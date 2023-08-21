import {Module} from "@nestjs/common";
import {FollowController} from "./follow.controller";
import {FollowService} from "./follow.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Eulogy} from "../eulogies/eulogy.model";
import {Eulogers} from "../eulogers/eulogers.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {FilesModule} from "../files/files.module";
import {Subscriptions} from "./subscription.model";
import {Likes} from "./likes.model";

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  imports: [
    SequelizeModule.forFeature([User, Eulogy, Eulogers, Subscriptions, Likes]),
    RolesModule,
    AuthModule,
    FilesModule,
  ],
})
export class FollowModule {}
