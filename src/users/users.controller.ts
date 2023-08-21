import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {UsersService} from "./users.service";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {User} from "./users.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";
import {UnbanUserDto} from "./dto/unban-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {Ban} from "./bans.model";
import {PremiumDto} from "./dto/premium.dto";

@ApiTags("کاربران")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({summary: "لیست همه کاربران"})
  @ApiResponse({status: 200, type: [User]})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  getAll(
    @Query("count") count: number,
    @Query("offset") offset: number,
  ): Promise<User[]> {
    return this.usersService.getAllUsers(count, offset);
  }

  @ApiOperation({summary: "جستجوی کاربر بر اساس آیدی"})
  @ApiResponse({status: 200, type: User})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get("/:value")
  getOne(@Param("value") value: number): Promise<User> {
    return this.usersService.getOneUserById(value);
  }

  @ApiOperation({summary: "ویرایش اطلاعات کاربر با آیدی"})
  @ApiResponse({status: 200, type: User})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Put("/:value")
  editOneById(
    @Param("value") value: number,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.editUserById(value, body);
  }

  @ApiOperation({summary: "تعیین نقش به کاربران"})
  @ApiResponse({status: 200, type: AddRoleDto})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/role")
  addRole(@Body() dto: AddRoleDto): Promise<AddRoleDto> {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({summary: "بن کردن کاربر"})
  @ApiResponse({status: 200, type: Ban})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/ban")
  ban(@Body() dto: BanUserDto): Promise<Ban> {
    return this.usersService.ban(dto);
  }

  @ApiOperation({summary: "خارج کردن کاربر از بن"})
  @ApiResponse({status: 200, type: Ban})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/unban")
  unban(@Body() dto: UnbanUserDto): Promise<Ban> {
    return this.usersService.unban(dto);
  }

  @ApiOperation({summary: "پریمیوم کردن کاربر"})
  @ApiResponse({status: 200, type: PremiumDto})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/premium")
  getPremium(@Body() dto: PremiumDto): Promise<PremiumDto> {
    return this.usersService.getPremium(dto);
  }

  @ApiOperation({summary: "خارج کردن کاربر از پریمیوم"})
  @ApiResponse({status: 200, type: PremiumDto})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/unPremium")
  removePremium(@Body() dto: PremiumDto): Promise<PremiumDto> {
    return this.usersService.removePremium(dto);
  }
}
