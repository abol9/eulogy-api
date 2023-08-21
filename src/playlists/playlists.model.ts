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
import {User} from "../users/users.model";
import {Eulogy} from "../eulogies/eulogy.model";
import {PlaylistEulogies} from "./playlist-eulogies.model";

interface PlaylistCreationAttrs {
  title: string;
  userId: number;
  image: string;
}

@Table({tableName: "playlists", collate: "utf8mb4_general_ci"})
export class Playlist extends Model<Playlist, PlaylistCreationAttrs> {
  @ApiProperty({example: "1", description: "آیدی"})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({example: "شب اول محرم", description: "عنوان لیست پخش"})
  @Column({type: DataType.STRING, unique: true, allowNull: false})
  title: string;

  @ApiProperty({
    example: "توضیحات لیست پخش",
    description: "این لیست پخش مداحی های شور است.",
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "این لیست پخش است.",
  })
  description: string;

  @ApiProperty({
    example: "playlistAvatars/dsadfk.jpg",
    description: "عکس لیست پخش",
  })
  @Column({type: DataType.STRING})
  image: string;

  @ApiProperty({example: 3, description: "شناسه کاربر"})
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER})
  userId: number;

  @BelongsTo(() => User)
  author: User;

  @BelongsToMany(() => Eulogy, () => PlaylistEulogies)
  eulogies: Eulogy[];
}
