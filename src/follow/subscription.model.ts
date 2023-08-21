import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {Eulogers} from "../eulogers/eulogers.model";

@Table({tableName: "subscriptions", updatedAt: false})
export class Subscriptions extends Model<Subscriptions> {
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

  @ApiProperty({example: "7", description: "Идентификатор музыканта"})
  @ForeignKey(() => Eulogers)
  @Column({type: DataType.INTEGER, allowNull: false})
  eulogerId: number;
}
