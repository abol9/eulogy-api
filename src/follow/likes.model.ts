import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {Eulogy} from "../eulogies/eulogy.model";

@Table({tableName: "likes", updatedAt: false})
export class Likes extends Model<Likes> {
  @ApiProperty({example: "1", description: "آیدی"})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({example: "4", description: "شناسه کاربر"})
  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, allowNull: false})
  userId: number;

  @ApiProperty({example: "7", description: "Идентификатор песни"})
  @ForeignKey(() => Eulogy)
  @Column({type: DataType.INTEGER, allowNull: false})
  eulogyId: number;
}
