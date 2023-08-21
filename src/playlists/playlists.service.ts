import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Playlist} from "./playlists.model";
import {CreatePlaylistDto} from "./dto/create-playlist.dto";
import {FilesService, FileType} from "../files/files.service";
import {AddEulogyToPlaylistDto} from "./dto/add-eulogy-to-playlist.dto";
import {PlaylistEulogies} from "./playlist-eulogies.model";
import {Eulogy} from "../eulogies/eulogy.model";
import {User} from "../users/users.model";

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectModel(Playlist) private playlistRepository: typeof Playlist,
    @InjectModel(PlaylistEulogies)
    private playlistSongsRepository: typeof PlaylistEulogies,
    @InjectModel(Eulogy) private eulogyRepository: typeof Eulogy,
    @InjectModel(User) private userRepository: typeof User,
    private fileService: FilesService,
  ) {}

  async create(
    dto: CreatePlaylistDto,
    image: any,
    userId: number,
  ): Promise<Playlist> {
    const user = this.userRepository.findByPk(userId);
    if (!user) {
      throw new HttpException("کاربر پیدا نشد", HttpStatus.NOT_FOUND);
    }

    let fileName = "no photo";
    if (image) {
      fileName = await this.fileService.createFile(
        image,
        FileType.PLAYLIST_IMAGE,
      );
    }

    const playlist = await this.playlistRepository.create({
      ...dto,
      image: fileName,
      userId: userId,
    });
    return playlist;
  }

  async addEulogyToPlaylist(dto: AddEulogyToPlaylistDto): Promise<Eulogy> {
    const eulogy = await this.eulogyRepository.findByPk(dto.eulogyId);
    const playlist = await this.playlistRepository.findByPk(dto.playlistId, {
      include: [Eulogy],
    });
    if (eulogy && playlist) {
      const hasEulogy = playlist.eulogies.find(
        (item) => item.id == dto.eulogyId,
      );
      if (hasEulogy) {
        throw new HttpException(
          "مداحی در لیست وجود دارد.",
          HttpStatus.CONFLICT,
        );
      }
      await playlist.$add("eulogy", eulogy.id);
      return eulogy;
    }
    throw new HttpException(
      "مداحی یا لیست پخش یافت نشد.",
      HttpStatus.NOT_FOUND,
    );
  }

  async playlists(userId: number): Promise<Playlist[]> {
    const playlists = await this.playlistRepository.findAll({
      where: {userId: userId},
    });
    return playlists;
  }

  async playlistForEulogy(
    eulogyId: number,
    userId: number,
  ): Promise<Playlist[]> {
    const playlists = await this.playlistRepository.findAll({
      where: {userId: userId},
    });
    const eulogy = await this.eulogyRepository.findByPk(eulogyId, {
      include: [Playlist],
    });
    if (eulogy) {
      const allowedPlaylists = playlists.filter(
        (playlist) =>
          !eulogy.playlists.find(
            (playlistEulogy) => playlistEulogy.id == playlist.id,
          ),
      );
      return allowedPlaylists;
    }
    throw new HttpException("مداحی مورد نظر یافت نشد.", HttpStatus.BAD_REQUEST);
  }

  async delete(value: number, userId: number): Promise<void> {
    const playlist = await this.playlistRepository.findByPk(value);
    if (playlist.userId === userId) {
      await playlist.destroy();
      return;
    }
    throw new HttpException(
      "لیست پخش یافت نشد یا شما اجازه دسترسی به آن را ندارید.",
      HttpStatus.BAD_REQUEST,
    );
  }
}
