import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";
import {ROLES_KEY} from "./roles-auth.decorator";
import {UsersService} from "../users/users.service";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Role} from "../roles/roles.model";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    // @InjectModel(User) private userRepository: typeof User,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(" ")[0];
      const token = authHeader.split(" ")[1];

      if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedException({
          message: "کاربر مجاز نیست",
        });
      }
      const user = await this.jwtService.verifyAsync(token);
      // const new_user = await this.userRepository.findByPk(user.id, {
      //   include: [Role],
      // });
      req.user = user;
      console.log(user);
      return user.roles.some((role) => requiredRoles.includes(role.value));
    } catch (e) {
      console.log(e);
      throw new HttpException("هیچ دسترسی", HttpStatus.FORBIDDEN);
    }
  }
}
