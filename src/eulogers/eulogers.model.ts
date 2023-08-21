import {
  BelongsTo,
  BelongsToMany,
  // BelongsTo,
  // BelongsToMan/y,
  Column,
  DataType,
  ForeignKey,
  // ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
// import { User } from '../users/users.model';
import {Album} from "../albums/albums.model";
import {Eulogy} from "../eulogies/eulogy.model";
import {User} from "../users/users.model";
import {Subscriptions} from "../follow/subscription.model";
// import { Subscriptions } from '../follow/subscription.model';

interface EulogerCreationAttrs {
  name: string;
  password: string;
  userId: number;
  image: string;
}

@Table({
  tableName: "eulogers",
  charset: "utf8mb4",
  collate: "utf8mb4_unicode_ci",
})
export class Eulogers extends Model<Eulogers, EulogerCreationAttrs> {
  @ApiProperty({example: "1", description: "آیدی"})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({example: "Bad Omens", description: "نام مداح"})
  @Column({type: DataType.STRING, allowNull: false, unique: true})
  name: string;
  //
  // @ApiProperty({
  //   example: '1234567',
  //   description: 'کلمه عبور к профилю исполнителя',
  // })
  // @Column({ type: DataType.STRING, allowNull: false })
  // password: string;

  @ApiProperty({
    example: "/avatarsEuloger/bmth.jpg",
    description: "عکس مداح",
  })
  @Column({type: DataType.STRING, defaultValue: "No photo"})
  image: string;

  @ApiProperty({
    description: "بیوگرافی",
  })
  @Column({type: DataType.STRING, defaultValue: ""})
  bio: string;

  @HasMany(() => Album)
  albums: Album[];

  @HasMany(() => Eulogy)
  eulogies: Eulogy[];

  // @ApiProperty({ example: 3, description: 'شناسه کاربر' })
  // @ForeignKey(() => User)
  // @Column({ type: DataType.INTEGER })
  // userId: number;

  // @BelongsTo(() => User)
  // user: User;

  @BelongsToMany(() => User, () => Subscriptions)
  users: User[];
}
