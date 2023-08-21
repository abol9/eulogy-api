import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {UsersModule} from "./users/users.module";
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/users.model";
import {RolesModule} from "./roles/roles.module";
import {UserRoles} from "./roles/user-roles.model";
import {Role} from "./roles/roles.model";
import {AuthModule} from "./auth/auth.module";
import {PlaylistsModule} from "./playlists/playlists.module";
import {Playlist} from "./playlists/playlists.model";
import {FilesModule} from "./files/files.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import {EulogersModule} from "./eulogers/eulogers.module";
import * as path from "path";
import {Eulogers} from "./eulogers/eulogers.model";
import {Ban} from "./users/bans.model";
import {Album} from "./albums/albums.model";
import {AlbumsModule} from "./albums/albums.module";
import {EulogyModule} from "./eulogies/eulogy.module";
import {Eulogy} from "./eulogies/eulogy.model";
import {PlaylistEulogies} from "./playlists/playlist-eulogies.model";
import {FollowModule} from "./follow/follow.module";
import {Subscriptions} from "./follow/subscription.model";
import {Likes} from "./follow/likes.model";
import {TokensModule} from "./tokens/tokens.module";
import {Token} from "./tokens/tokens.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, "static"),
    }),
    SequelizeModule.forRoot({
      dialect: "sqlite",
      dialectOptions: {
        charset: "utf8mb4",
      },
      // host: process.env.POSTGRES_HOST,
      // port: Number(process.env.POSTGRES_PORT),
      // username: process.env.POSTGRES_USER,
      // password: String(process.env.POSTGRES_PASSWORD),
      storage: process.env.SQLITE_DB,
      models: [
        User,
        Ban,
        Role,
        UserRoles,
        Playlist,
        Eulogers,
        Album,
        Eulogy,
        PlaylistEulogies,
        Subscriptions,
        Likes,
        Token,
      ],
      autoLoadModels: true,
      synchronize: true,
    }),
    AppModule,
    UsersModule,
    RolesModule,
    AuthModule,
    PlaylistsModule,
    FilesModule,
    EulogersModule,
    AlbumsModule,
    EulogyModule,
    FollowModule,
    TokensModule,
  ],
})
export class AppModule {}
