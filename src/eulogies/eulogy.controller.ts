import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UploadedFile, UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {EulogyService} from "./eulogy.service";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {CreateEulogyDto} from "./dto/create-eulogy.dto";
import {Eulogy} from "./eulogy.model";

@ApiTags("مداحی ها")
@Controller("eulogy")
export class EulogyController {
  constructor(private eulogyService: EulogyService) {}

  @ApiOperation({summary: "ایجاد مداحی"})
  @ApiResponse({status: 200, type: Eulogy})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      {name: "audio", maxCount: 1},
      {name: "image", maxCount: 1},
    ]),
  )
  createEulogy(
    @Body() dto: CreateEulogyDto,
    @UploadedFiles() files,
  ): Promise<Eulogy> {
    return this.eulogyService.create(dto, files);
  }

  @ApiOperation({summary: "گوش کردن مداحی"})
  @ApiResponse({status: 204})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Post("/listen/:id")
  @HttpCode(204)
  listen(@Param("id") id: number): Promise<void> {
    return this.eulogyService.listen(id);
  }

  @ApiOperation({summary: "جستجوی مداحی بر اساس آیدی"})
  @ApiResponse({status: 200, type: Eulogy})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Post("/:id")
  getOneEulogy(@Param("id") id: number): Promise<any> {
    return this.eulogyService.getOneEulogy(id);
  }

  @ApiOperation({summary: "جستجو مداحی بر اساس نام"})
  @ApiResponse({status: 200, type: [Eulogy]})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get("/search/name")
  search(@Query("name") name: string): Promise<Eulogy[]> {
    return this.eulogyService.searchByName(name);
  }

  @ApiOperation({summary: "جدیدترین مداحی ها"})
  @ApiResponse({status: 200, type: [Eulogy]})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get("/latest")
  latest(@Query("limit") limit = 20): Promise<Eulogy[]> {
    return this.eulogyService.latest(limit);
  }

  @ApiOperation({summary: "مداحی های مداح"})
  @ApiResponse({status: 200, type: [Eulogy]})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get("/euloger/:id")
  eulogerEulogies(
    @Query("limit") limit = 20,
    @Param("id") eulogerId: number,
  ): Promise<Eulogy[]> {
    return this.eulogyService.searchByEuloger(eulogerId, limit);
  }

  @ApiOperation({summary: "جدیدترین مداحی ها"})
  @ApiResponse({status: 200, type: [Eulogy]})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get("/popular")
  mostListens(@Query("limit") limit = 20): Promise<Eulogy[]> {
    return this.eulogyService.mostListens(limit);
  }
}
