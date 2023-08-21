import {
  Body,
  Controller,
  Delete, Get,
  HttpCode,
  Optional,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {CreatePlaylistDto} from "./dto/create-playlist.dto";
import {PlaylistsService} from "./playlists.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {Playlist} from "./playlists.model";
import {AddEulogyToPlaylistDto} from "./dto/add-eulogy-to-playlist.dto";
import {Eulogy} from "../eulogies/eulogy.model";

@ApiTags("لیست پخش")
@Controller("playlists")
export class PlaylistsController {
  constructor(private playlistService: PlaylistsService) {}

  @ApiOperation({summary: "ایجاد لیست پخش"})
  @ApiResponse({status: 200, type: Playlist})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  createPlaylist(
    @Body() dto: CreatePlaylistDto,
    @UploadedFile() @Optional() image,
    @Req() request,
  ): Promise<Playlist> {
    return this.playlistService.create(dto, image, request.user.id);
  }

  @ApiOperation({summary: "افزودن مداحی به لیست پخش"})
  @ApiResponse({status: 200, type: Eulogy})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Post("/adding")
  addEulogyToPlaylist(@Body() dto: AddEulogyToPlaylistDto): Promise<Eulogy> {
    return this.playlistService.addEulogyToPlaylist(dto);
  }

  @ApiOperation({summary: "لیست تمام لیست پخش های کاربر"})
  @ApiResponse({status: 200, type: Eulogy})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get()
  listPlaylistsForUser(
    @Req() request,
  ): Promise<Playlist[]> {
    return this.playlistService.playlists(request.user.id);
  }

  @ApiOperation({summary: "لیست های پخش قابل افزودن یک مداحی"})
  @ApiResponse({status: 200, type: Eulogy})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Get("/list/:id")
  playlistForEulogy(
    @Param("id") eulogyId: number,
    @Req() request,
  ): Promise<Playlist[]> {
    return this.playlistService.playlistForEulogy(eulogyId, request.user.id);
  }

  @ApiOperation({summary: "Удаление плейлиста"})
  @ApiResponse({status: 204})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Delete("/:value")
  @HttpCode(204)
  deletePlaylist(@Param("value") value: number, @Req() request): Promise<void> {
    return this.playlistService.delete(value, request.user.id);
  }
}
