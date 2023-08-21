import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Eulogers} from "../eulogers/eulogers.model";
import {Album} from "../albums/albums.model";
import {User} from "../users/users.model";
import {Playlist} from "../playlists/playlists.model";
import {PlaylistEulogies} from "../playlists/playlist-eulogies.model";
import {Likes} from "../follow/likes.model";

interface EulogyCreationAttrs {
  title: string;
  audio: string;
  eulogerId: number;
  albumId: number;
  image: string;
}

@Table({
  tableName: "eulogies",
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",})
export class Eulogy extends Model<Eulogy, EulogyCreationAttrs> {
  @ApiProperty({example: "1", description: "آیدی"})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({example: "True friend", description: "عنوان مداحی"})
  @Column({type: DataType.STRING, allowNull: false, unique: true})
  title: string;

  @ApiProperty({example: "3 234", description: "تعداد "})
  @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0})
  listens: number;

  @ApiProperty({example: "/eulogies/file1.mp3", description: "فایل مداحی"})
  @Column({type: DataType.STRING})
  audio: string;

  @ApiProperty({example: "/images/image.jpg", description: "عکس مداحی"})
  @Column({type: DataType.STRING})
  image: string;

  @ApiProperty({example: "120", description: "زمان مداحی"})
  @Column({type: DataType.STRING})
  duration: string;

  @ApiProperty({example: "3", description: "آیدی مداح"})
  @ForeignKey(() => Eulogers)
  @Column({type: DataType.INTEGER, allowNull: false})
  eulogerId: number;

  @BelongsTo(() => Eulogers)
  author: Eulogers;

  @ApiProperty({example: "2", description: "آیدی آلبوم"})
  @ForeignKey(() => Album)
  @Column({type: DataType.INTEGER, allowNull: false})
  albumId: number;

  @BelongsTo(() => Album)
  album: Album;

  @BelongsToMany(() => Playlist, () => PlaylistEulogies)
  playlists: Playlist[];

  @BelongsToMany(() => User, () => Likes)
  users: User[];
}
