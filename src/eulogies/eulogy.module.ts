import {Module} from "@nestjs/common";
import {EulogyService} from "./eulogy.service";
import {EulogyController} from "./eulogy.controller";
import {SequelizeModule} from "@nestjs/sequelize";
import {Eulogers} from "../eulogers/eulogers.model";
import {Album} from "../albums/albums.model";
import {Eulogy} from "./eulogy.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {FilesModule} from "../files/files.module";
import {Playlist} from "../playlists/playlists.model";
import {PlaylistEulogies} from "../playlists/playlist-eulogies.model";
import {Likes} from "../follow/likes.model";

@Module({
  providers: [EulogyService],
  controllers: [EulogyController],
  imports: [
    SequelizeModule.forFeature([
      Eulogers,
      Album,
      Eulogy,
      Playlist,
      PlaylistEulogies,
      Likes,
    ]),
    RolesModule,
    AuthModule,
    FilesModule,
  ],
})
export class EulogyModule {}
