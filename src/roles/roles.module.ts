import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { User } from '../users/users.model';
import { UserRoles } from './user-roles.model';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from "../users/users.module";

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    SequelizeModule.forFeature([Role, User, UserRoles]),
    AuthModule,
    // UsersModule,
  ],
  exports: [RolesService],
})
export class RolesModule {}
