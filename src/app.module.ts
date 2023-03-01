import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import {UserRoles} from "./roles/user-roles.model";
import {Role} from "./roles/roles.model";
import { AuthModule } from './auth/auth.module';
import { PlaylistsModule } from './playlists/playlists.module';
import {Playlist} from "./playlists/playlists.model";
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { MusiciansModule } from './musicians/musicians.module';
import * as path from 'path';
import {Musician} from "./musicians/musicians.model";
import {Ban} from "./users/bans.model";
import {Album} from "./albums/albums.model";
import {AlbumsModule} from "./albums/albums.module";
import { SongsModule } from './songs/songs.module';
import {Song} from "./songs/songs.model";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, UserRoles, Playlist, Musician, Ban, Album, Song],
            autoLoadModels: true,
        }),
        UsersModule,
        RolesModule,
        AuthModule,
        PlaylistsModule,
        FilesModule,
        MusiciansModule,
        AlbumsModule,
        SongsModule,
    ]
})


export class AppModule {}