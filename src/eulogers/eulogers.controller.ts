import {
  Body,
  Controller, Delete,
  Get,
  Optional,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {EulogersService} from "./eulogers.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {CreateEulogerDto} from "./dto/create-euloger.dto";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {Eulogers} from "./eulogers.model";

@ApiTags("مداح ها")
@Controller("eulogers")
export class EulogersController {
  constructor(private eulogerService: EulogersService) {}

  @ApiOperation({summary: "لیست مداح ها"})
  @ApiResponse({status: 200, type: [Eulogers]})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get()
  getAll(): Promise<Eulogers[]> {
    return this.eulogerService.getAllEulogers();
  }

  @ApiOperation({summary: "حذف مداح"})
  @ApiResponse({status: 200, type: [Eulogers]})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete("/:id")
  deleteEuloger(@Param("id") eulogerId: number): Promise<void> {
    return this.eulogerService.deleteEuloger(eulogerId);
  }

  @ApiOperation({summary: "پیدا کردن مداح بر اساس آیدی"})
  @ApiResponse({status: 200, type: Eulogers})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Get("/:value")
  getOne(@Param("value") value: number): Promise<Eulogers> {
    return this.eulogerService.getOneEulogerById(value);
  }

  @ApiOperation({summary: "ایجاد مداح"})
  @ApiResponse({status: 200, type: Eulogers})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post("/registration")
  @UseInterceptors(FileInterceptor("image"))
  createEuloger(
    @Body() dto: CreateEulogerDto,
    @UploadedFile() @Optional() image,
    @Req() request,
  ): Promise<Eulogers> {
    return this.eulogerService.create(dto, image);
  }

  @ApiOperation({summary: "جستجوی مداح بر اساس نام"})
  @ApiResponse({status: 200, type: [Eulogers]})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get("/search/name")
  search(@Query("name") name: string): Promise<Eulogers[]> {
    return this.eulogerService.searchByName(name);
  }
}
