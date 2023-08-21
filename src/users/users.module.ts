import {forwardRef, Module} from "@nestjs/common";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Playlist} from "../playlists/playlists.model";
import {Eulogers} from "../eulogers/eulogers.model";
import {Ban} from "./bans.model";
import {Eulogy} from "../eulogies/eulogy.model";
import {Likes} from "../follow/likes.model";
import {Subscriptions} from "../follow/subscription.model";
import {Token} from "../tokens/tokens.model";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      UserRoles,
      Playlist,
      Eulogers,
      Ban,
      Subscriptions,
      Likes,
      Eulogy,
      Token,
    ]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
