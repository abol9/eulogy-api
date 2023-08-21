import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {User} from "../users/users.model";
import {UserRoles} from "./user-roles.model";

interface RoleCreationAttrs {
  value: string;
  description: string;
}

@Table({tableName: "roles", collate: "utf8mb4_general_ci"})
export class Role extends Model<Role, RoleCreationAttrs> {
  @ApiProperty({example: "1", description: "آیدی"})
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({example: "ADMIN", description: "Значение роли пользователя"})
  @Column({type: DataType.STRING, unique: true, allowNull: false})
  value: string;

  @ApiPropertyOptional({
    example: "Администратор",
    description: "Описание роли",
  })
  @Column({type: DataType.STRING, allowNull: false})
  description: string;

  @BelongsToMany(() => User, () => UserRoles)
  users: User[];
}
