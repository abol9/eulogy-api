import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  Model,
  Table,
} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../roles/roles.model";
import {UserRoles} from "../roles/user-roles.model";
import {Playlist} from "../playlists/playlists.model";
import {Eulogers} from "../eulogers/eulogers.model";
import {Ban} from "./bans.model";
import {Eulogy} from "../eulogies/eulogy.model";
import {Subscriptions} from "../follow/subscription.model";
import {Likes} from "../follow/likes.model";
import {Token} from "../tokens/tokens.model";

interface UserCreationAttrs {
  email: string;
  password: string;
  username: string;
}

@Table({tableName: "users", collate: "utf8mb4_general_ci"})
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({example: "1", description: "آیدی"})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({example: "user@outlook.com", description: "ایمیل"})
  @Column({type: DataType.STRING, unique: true, allowNull: false})
  email: string;

  @ApiProperty({example: "hash(1234567)", description: "کلمه عبور"})
  @Column({type: DataType.STRING, allowNull: false})
  password: string;

  @ApiProperty({example: "Shroud", description: "نام کاربری"})
  @Column({type: DataType.STRING, allowNull: false})
  username: string;

  @ApiProperty({example: "false", description: "فعال بودن کاربر"})
  @Column({type: DataType.BOOLEAN, defaultValue: true})
  isActivated: boolean;

  @ApiProperty({
    example: "Link",
    description: "لینک فعال سازی اکانت",
  })
  @Column({type: DataType.STRING})
  activationLink: string;

  @ApiProperty({example: "true", description: "Премиум пользователь"})
  @Column({type: DataType.BOOLEAN, defaultValue: false})
  isPremium: boolean;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasMany(() => Playlist)
  playlists: Playlist[];

  @HasOne(() => Ban)
  bans: Ban;

  @HasOne(() => Token)
  tokens: Token;

  @BelongsToMany(() => Eulogers, () => Subscriptions)
  eulogersSubscription: Eulogers[];

  @BelongsToMany(() => Eulogy, () => Likes)
  eulogiesLikes: Eulogy[];
}
