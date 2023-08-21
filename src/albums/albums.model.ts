import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Eulogers} from "../eulogers/eulogers.model";
import {Eulogy} from "../eulogies/eulogy.model";

interface AlbumCreationAttrs {
  title: string;
  eulogerId: number;
  image: string;
}

@Table({tableName: "albums"})
export class Album extends Model<Album, AlbumCreationAttrs> {
  @ApiProperty({example: "1", description: "آیدی"})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({example: "Sempiternal", description: "عنوان آلبوم"})
  @Column({type: DataType.STRING, allowNull: false})
  title: string;

  @ApiProperty({
    example: "/image/albumImage.jpg",
    description: "آدرس عکس جلد آلبوم",
  })
  @Column({type: DataType.STRING})
  image: string;

  @HasMany(() => Eulogy)
  eulogies: Eulogy[];

  @ApiProperty({example: 3, description: "آیدی مداح"})
  @ForeignKey(() => Eulogers)
  @Column({type: DataType.INTEGER})
  eulogerId: number;

  @BelongsTo(() => Eulogers)
  author: Eulogers;
}
