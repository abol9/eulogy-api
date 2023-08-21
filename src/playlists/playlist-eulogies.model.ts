import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Playlist} from "./playlists.model";
import {Eulogy} from "../eulogies/eulogy.model";

@Table({tableName: "playlist_eulogies", createdAt: false, updatedAt: false})
export class PlaylistEulogies extends Model<PlaylistEulogies> {
  @ApiProperty({example: "1", description: "آیدی"})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({example: "2", description: "آیدی لیست پخش"})
  @ForeignKey(() => Playlist)
  @Column({type: DataType.INTEGER, allowNull: false})
  playlistId: number;

  @ApiProperty({example: "4", description: "آیدی مداحی"})
  @ForeignKey(() => Eulogy)
  @Column({type: DataType.INTEGER, allowNull: false})
  eulogyId: number;
}
