import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserLinkDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {Ban} from "./bans.model";
import {UnbanUserDto} from "./dto/unban-user.dto";
import {Eulogers} from "../eulogers/eulogers.model";
import {Eulogy} from "../eulogies/eulogy.model";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as bcrypt from "bcryptjs";
import {PremiumDto} from "./dto/premium.dto";
import { Role } from "../roles/roles.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Ban) private banRepository: typeof Ban,
    @InjectModel(Eulogers) private eulogerRepository: typeof Eulogers,
    @InjectModel(Eulogy) private eulogyRepository: typeof Eulogy,
    private roleService: RolesService,
  ) {}

  async createUser(dto: CreateUserLinkDto): Promise<User> {
    const user = await this.userRepository.create(dto);
    const role = await this.roleService.getRoleByValue("USER");
    await user.$set("roles", [role.id]);
    user.roles = [role];
    const banInfo = {
      userId: Number(user.dataValues.id),
      banned: false,
    };
    await this.banRepository.create(banInfo);
    return user;
  }

  async createSuperuser(dto: CreateUserLinkDto): Promise<User> {
    const user = await this.userRepository.create(dto);
    console.log(user);

    const roleUser = await this.roleService.getRoleByValue("USER");
    if (!roleUser) {
      await this.roleService.createRole({
        value: "USER",
        description: "کاربر",
      });
    }

    const roleAdmin = await this.roleService.getRoleByValue("ADMIN");
    if (!roleAdmin) {
      await this.roleService.createRole({
        value: "ADMIN",
        description: "مدیر",
      });
    }

    const roleEuloger = await this.roleService.getRoleByValue("EULOGER");
    if (!roleEuloger) {
      await this.roleService.createRole({
        value: "EULOGER",
        description: "مداح",
      });
    }

    await this.addRole({userId: user.id, value: "USER"});
    await this.addRole({userId: user.id, value: "ADMIN"});
    await this.addRole({userId: user.id, value: "EULOGER"});

    const banInfo = {
      userId: Number(user.dataValues.id),
      banned: false,
    };
    await this.banRepository.create(banInfo);
    const newUser = this.userRepository.findByPk(user.id, {include: [Role]});

    return newUser;
  }

  async getAllUsers(count = 10, offset = 0): Promise<User[]> {
    const users = await this.userRepository.findAll({
      include: {all: true},
      offset,
      limit: count,
    });
    return users;
  }

  async getOneUserById(value: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {id: value},
      include: {all: true},
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {email},
      include: {all: true},
    });
    return user;
  }

  async addRole(dto: AddRoleDto): Promise<AddRoleDto> {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (user && role) {
      await user.$add("role", role.id);
      return dto;
    }
    throw new HttpException(
      "کاربر یا نقش پیدا نشد",
      HttpStatus.NOT_FOUND,
    );
  }

  async ban(dto: BanUserDto): Promise<Ban> {
    const user = await this.banRepository.findOne({
      where: {userId: dto.userId},
    });
    if (user) {
      if (!user.banned) {
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
      }
      throw new HttpException("کاربر قبلاً بن شده است", HttpStatus.BAD_REQUEST);
    }
    throw new HttpException("َکاربر پیدا نشد", HttpStatus.BAD_REQUEST);
  }

  async unban(dto: UnbanUserDto): Promise<Ban> {
    const user = await this.banRepository.findOne({
      where: {userId: dto.userId},
    });
    if (user) {
      if (user.banned) {
        user.banned = false;
        user.banReason = "ممنوع نیست";
        await user.save();
        return user;
      }
      throw new HttpException("کاربر ممنوع نیست", HttpStatus.BAD_REQUEST);
    }
    throw new HttpException("کاربر پیدا نشد", HttpStatus.BAD_REQUEST);
  }

  async editUserById(value: number, body: UpdateUserDto): Promise<User> {
    let user = await this.userRepository.findByPk(value);

    if (user) {
      let hashPassword = user.password;
      if (body.password) {
        hashPassword = await bcrypt.hash(body.password, 5);
      }
      const updatedUser = Object.assign(user, body, {
        password: hashPassword,
      });
      user = updatedUser;
      await user.save();
      return user;
    }
    throw new HttpException("کاربر پیدا نشد", HttpStatus.NOT_FOUND);
  }

  async getPremium(dto: PremiumDto): Promise<PremiumDto> {
    const user = await this.userRepository.findByPk(dto.userId);
    if (user) {
      user.isPremium = true;
      await user.save();
      return dto;
    }
    throw new HttpException("کاربر پیدا نشد", HttpStatus.NOT_FOUND);
  }

  async removePremium(dto: PremiumDto): Promise<PremiumDto> {
    const user = await this.userRepository.findByPk(dto.userId);
    if (user) {
      user.isPremium = false;
      await user.save();
      return dto;
    }
    throw new HttpException("کاربر پیدا نشد", HttpStatus.NOT_FOUND);
  }
}
