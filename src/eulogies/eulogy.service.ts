import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {Eulogy} from "./eulogy.model";
import {FilesService, FileType} from "../files/files.service";
import {CreateEulogyDto} from "./dto/create-eulogy.dto";
import {Op} from "sequelize";
import * as fs from "fs";
import { Album } from "../albums/albums.model";
import { Eulogers } from "../eulogers/eulogers.model";
import { response } from "express";
@Injectable()
export class EulogyService {
  constructor(
    @InjectModel(Eulogy) private eulogyRepository: typeof Eulogy,
    private fileService: FilesService,
  ) {}

  async create(dto: CreateEulogyDto, files: any): Promise<Eulogy> {
    const audioPath = await this.fileService.createFile(
      files["audio"][0],
      FileType.AUDIO,
    );
    const imagePath = await this.fileService.createFile(
      files["image"][0],
      FileType.EULOGY_IMAGE,
    );
    const eulogy = await this.eulogyRepository.create({
      ...dto,
      audio: audioPath,
      image: imagePath,
    });
    return eulogy;
  }

  async listen(id: number): Promise<void> {
    const eulogy = await this.eulogyRepository.findByPk(id);
    if (eulogy) {
      eulogy.listens += 1;
      await eulogy.save();
      return;
    }
    throw new HttpException("مداحی پیدا نشد", HttpStatus.BAD_REQUEST);
  }

  async getOneEulogy(id: number): Promise<any> {
    const eulogy = await this.eulogyRepository.findByPk(id, {
      include: [Album, Eulogers],
    });
    const {album, author, ...eu} = eulogy.toJSON();
    return {...eu, album: album.title, author: author.name};
  }

  async getRandomEulogies(count: number): Promise<Eulogy[]> {
    const eulogies = await this.eulogyRepository.findAll({
      include: {all: true},
      limit: count,
    });
    return eulogies;
  }

  async searchByName(name: string): Promise<Eulogy[]> {
    return this.eulogyRepository.findAll({
      where: {
        title: {
          [Op.like]: `%${name}%`,
        },
      },
    });
  }

  async searchByEuloger(eulogerId: number, limit: number): Promise<Eulogy[]> {
    const euloger = await this.eulogyRepository.findByPk(eulogerId);
    if (euloger) {
      return this.eulogyRepository.findAll({
        where: {
          eulogerId: eulogerId,
        },
        limit: limit,
      });
    }
    throw new HttpException("مداح یافت نشد.", HttpStatus.NOT_FOUND);
  }

  async latest(limit): Promise<any[]> {
    const eulogies = await this.eulogyRepository.findAll({
      include: [Eulogers, Album],
      order: [["createdAt", "DESC"]],
      limit: limit,
    });
    return eulogies.map((eulogy) => {
      const {album, author, ...eu} = eulogy.toJSON();
      return {...eu, album: album.title, author: author.name};
    });
  }

  async mostListens(limit): Promise<Eulogy[]> {
    return this.eulogyRepository.findAll({
      order: [["listens", "DESC"]],
      limit: limit,
      where: {
        listens: {
          [Op.gt]: 0,
        },
      },
    });
  }

  //todo
  // async mostLikes(limit): Promise<Eulogy[]> {
  //   return this.eulogyRepository.findAll({
  //     include: [Likes],
  //     order: [["listens", "DESC"]],
  //     limit: limit,
  //     where: {
  //       likes: {
  //         [Op.gt]: 0,
  //       },
  //     },
  //   });
  // }
}
