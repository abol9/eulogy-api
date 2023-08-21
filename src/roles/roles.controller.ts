import {Body, Controller, Get, Param, Post, UseGuards} from "@nestjs/common";
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Role} from "./roles.model";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";

@ApiTags("نقش ها")
@Controller("roles")
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({summary: "ایجاد نقش"})
  @ApiResponse({status: 200, type: Role})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() dto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(dto);
  }

  @ApiOperation({summary: "جستجو نقش بر اساس نام"})
  @ApiResponse({status: 200, type: Role})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get("/:value")
  getByValue(@Param("value") value: string): Promise<Role> {
    return this.roleService.getRoleByValue(value);
  }

  @ApiOperation({summary: "لیست همه نقش ها"})
  @ApiResponse({status: 200, type: [Role]})
  // @Roles("ADMIN")
  // @UseGuards(RolesGuard)
  @Get()
  getAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRoles();
  }
}
