import {Module} from "@nestjs/common";
import {EulogersService} from "./eulogers.service";
import {EulogersController} from "./eulogers.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {FilesModule} from "../files/files.module";
import {Eulogers} from "./eulogers.model";
import {AuthModule} from "../auth/auth.module";
import {Album} from "../albums/albums.model";
import {RolesModule} from "../roles/roles.module";
import {Eulogy} from "../eulogies/eulogy.model";
import {Subscriptions} from "../follow/subscription.model";

@Module({
  providers: [EulogersService],
  controllers: [EulogersController],
  imports: [
    SequelizeModule.forFeature([User, Eulogers, Album, Eulogy, Subscriptions]),
    RolesModule,
    FilesModule,
    AuthModule,
  ],
})
export class EulogersModule {}
