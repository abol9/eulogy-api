import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Album } from "./albums.model";
import { FilesService, FileType } from "../files/files.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Eulogy } from "../eulogies/eulogy.model";
import { Eulogers } from "../eulogers/eulogers.model";
import { Op } from "sequelize";

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album) private albumRepository: typeof Album,
    @InjectModel(Eulogy) private eulogyRepository: typeof Eulogy,
    @InjectModel(Eulogers) private eulogerRepository: typeof Eulogers,
    private fileService: FilesService
  ) {
  }

  async create(dto: CreateAlbumDto, image: any): Promise<Album> {
    const euloger = await this.eulogerRepository.findOne({
      where: { id: dto.eulogerId }
    });
    if (!euloger) {
      throw new HttpException("مداح پیدا نشد", HttpStatus.NOT_FOUND);
    }

    let fileName = "noPhoto";
    if (image) {
      fileName = await this.fileService.createFile(
        image,
        FileType.ALBUMS_IMAGE
      );
    }

    const album = await this.albumRepository.create({
      ...dto,
      image: fileName,
      eulogerId: euloger.id
    });
    return album;
  }

  async getAllAlbums(count: number, offset: number): Promise<Album[]> {
    const albums = this.albumRepository.findAll({
      offset,
      limit: count,
    });
    return albums;
  }

  async getOneAlbum(albumId: number): Promise<Album> {
    const album = this.albumRepository.findByPk(albumId, {
      include: {
        all: true,
      },
    });
    return album;
  }

  async deleteAlbumById(value: number, userId: number): Promise<Album> {
    const album = await this.albumRepository.findByPk(value, {
      include: { all: true }
    });
    if (!album) {
      throw new HttpException("Альбом не найден", HttpStatus.NOT_FOUND);
    }

    await this.eulogyRepository.destroy({
      where: {
        albumId: value
      }
    });
    await album.destroy();
    return album;

    throw new HttpException(
      "خطای حذف آلبوم",
      HttpStatus.BAD_REQUEST
    );
  }

  async searchByName(name: string): Promise<Album[]> {
    return this.albumRepository.findAll({
      where: {
        title: {
          [Op.iLike]: `%${name}%`
        }
      }
    });
  }
}
