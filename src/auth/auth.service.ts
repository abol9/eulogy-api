import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {LoginUserDto} from "./dto/login-user.dto";
import {UsersService} from "../users/users.service";
import * as bcrypt from "bcryptjs";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {User} from "../users/users.model";
import {v4 as uuidv4} from "uuid";
import {MailService} from "./mail.service";
import {InjectModel} from "@nestjs/sequelize";
import {RegisterUserResponseDto} from "./dto/register-user-response.dto";
import {Request} from "express";
import {TokenService} from "../tokens/tokens.service";
import {LogoutUserResponseDto} from "./dto/logout-user-response.dto";
import {Role} from "../roles/roles.model";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private userService: UsersService,
    private tokenService: TokenService,
    private mailService: MailService,
  ) {}

  async login(userDto: LoginUserDto): Promise<RegisterUserResponseDto> {
    const user = await this.validateUser(userDto);
    const tokens = await this.tokenService.generateToken(user);
    const tokenInfo = {
      userId: user.id,
      refreshToken: tokens.refreshToken,
    };
    await this.tokenService.saveToken(tokenInfo);
    const userDtoResponse = Object.assign(userDto);
    delete userDtoResponse.password;

    return {
      ...tokens,
      user: userDtoResponse,
    };
  }

  private async validateUser(userDto: LoginUserDto): Promise<User> {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: "کاربری با این ایمیل وجود ندارد.",
      });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: "رمزعبور اشتباه است",
    });
  }

  async registration(userDto: CreateUserDto): Promise<RegisterUserResponseDto> {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        "Пользователь с таким email уже существует",
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const activationLink = uuidv4();

    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
      activationLink,
    });

    // todo. Google disabled auth
    if (process.env.MAIL_ACCEPT) {
      await this.mailService.sendActivationMail(
        userDto.email,
        `${process.env.API_URL}/auth/activate/${activationLink}`,
      );
    }

    const tokens = await this.tokenService.generateToken(user);

    const tokenInfo = {
      userId: user.id,
      refreshToken: tokens.refreshToken,
    };
    await this.tokenService.saveToken(tokenInfo);

    const userDtoResponse = Object.assign(userDto);
    delete userDtoResponse.password;

    return {
      ...tokens,
      user: userDtoResponse,
    };
  }

  async registrationSuperUser(
    userDto: CreateUserDto,
  ): Promise<RegisterUserResponseDto> {
    // const userDto = {
    //   email: process.env.ADMIN_MAIL,
    //   password: process.env.ADMIN_PASSWORD,
    //   username: process.env.ADMIN_USERNAME,
    // };
    // const candidate = await this.userService.getAllUsers(1);
    // if (candidate.length) {
    //   throw new HttpException("کاربری یافت نشد", HttpStatus.BAD_REQUEST);
    // }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createSuperuser({
      ...userDto,
      activationLink: "true",
      password: hashPassword,
    });
    console.log(user);
    const tokens = await this.tokenService.generateToken(user);

    const tokenInfo = {
      userId: user.id,
      refreshToken: tokens.refreshToken,
    };
    await this.tokenService.saveToken(tokenInfo);

    const userDtoResponse = Object.assign(userDto);
    delete userDtoResponse.password;

    return {
      ...tokens,
      user: userDtoResponse,
    };
  }

  async tokens(): Promise<any> {
    return await this.tokenService.getTokens();
  }

  async logout(request: Request): Promise<LogoutUserResponseDto> {
    const {refreshToken} = request.cookies;
    if (!refreshToken)
      throw new HttpException("Токен не найден", HttpStatus.NOT_FOUND);
    const token = await this.tokenService.removeToken(refreshToken);
    return {
      refreshToken: token || "",
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException({
        message: "کاربر مجاز نیست",
      });
    }
    const tokenFromDb = await this.tokenService.findToken(refreshToken);

    if (!tokenFromDb) {
      throw new UnauthorizedException({
        message: "کاربر مجاز نیست",
      });
    }
    const user = await this.userRepository.findByPk(tokenFromDb.dataValues.id, {
      include: [Role],
    });

    const tokens = await this.tokenService.generateToken(user);

    const tokenInfo = {
      userId: user.id,
      refreshToken: tokens.refreshToken,
    };
    await this.tokenService.saveToken(tokenInfo);

    return {
      ...tokens,
      user,
    };
  }

  async activate(activationLink: string) {
    const user = await this.userRepository.findOne({
      where: {
        activationLink,
      },
    });
    if (!user) {
      throw new HttpException(
        "کاربر با این لینک وجود ندارد",
        HttpStatus.BAD_REQUEST,
      );
    }
    user.isActivated = true;
    await user.save();
  }
}
