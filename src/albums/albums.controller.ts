import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Optional,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {AlbumsService} from "./albums.service";
import {CreateAlbumDto} from "./dto/create-album.dto";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {Album} from "./albums.model";

@ApiTags("آلبوم ها")
@Controller("albums")
export class AlbumsController {
  constructor(private albumService: AlbumsService) {}

  @ApiOperation({summary: "ایجاد آلبوم"})
  @ApiResponse({status: 200, type: Album})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  createAlbum(
    @Body() dto: CreateAlbumDto,
    @UploadedFile() @Optional() image,
    @Req() request,
  ): Promise<Album> {
    return this.albumService.create(dto, image);
  }

  @ApiOperation({summary: "لیست آلبوم ها"})
  @ApiResponse({status: 200, type: [Album]})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get()
  getAllAlbums(
    @Query("count") count: number,
    @Query("offset") offset: number,
  ): Promise<Album[]> {
    return this.albumService.getAllAlbums(count, offset);
  }


  @ApiOperation({summary:"جستجوی یک آلبوم با آیدی"})
  @ApiResponse({status: 200, type: [Album]})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get(":id")
  getOneAlbum(@Param("id") albumId: number): Promise<Album> {
    return this.albumService.getOneAlbum(albumId);
  }
  @ApiOperation({summary: "حذف یک آلبوم با همه آهنگ‌های مرتبط"})
  @ApiResponse({status: 200, type: Album})
  @Roles("ADMIN")
  @UseGuards(RolesGuard)
  @Delete("/:value")
  @HttpCode(200)
  deleteAlbumById(
    @Param("value") value: number,
    @Req() request,
  ): Promise<Album> {
    return this.albumService.deleteAlbumById(value, request.user.id);
  }

  @ApiOperation({summary: "Поиск альбомов по имени"})
  @ApiResponse({status: 200, type: [Album]})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get("/search/name")
  search(@Query("name") name: string): Promise<Album[]> {
    return this.albumService.searchByName(name);
  }
}
