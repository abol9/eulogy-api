import {Module} from "@nestjs/common";
import {AlbumsService} from "./albums.service";
import {AlbumsController} from "./albums.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Eulogers} from "../eulogers/eulogers.model";
import {Album} from "./albums.model";
import {FilesModule} from "../files/files.module";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {Eulogy} from "../eulogies/eulogy.model";

@Module({
  providers: [AlbumsService],
  controllers: [AlbumsController],
  imports: [
    SequelizeModule.forFeature([Eulogers, Album, Eulogy]),
    RolesModule,
    AuthModule,
    FilesModule,
  ],
})
export class AlbumsModule {}
