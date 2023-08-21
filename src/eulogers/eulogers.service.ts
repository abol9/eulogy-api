import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {CreateEulogerDto} from "./dto/create-euloger.dto";
import {InjectModel} from "@nestjs/sequelize";
import {FilesService, FileType} from "../files/files.service";
import {Eulogers} from "./eulogers.model";
import {Op} from "sequelize";

@Injectable()
export class EulogersService {
  constructor(
    @InjectModel(Eulogers) private eulogerRepository: typeof Eulogers,
    private fileService: FilesService,
  ) {}

  async create(dto: CreateEulogerDto, image: any): Promise<Eulogers> {
    const hasEuloger = await this.eulogerRepository.findOne({
      where: {
        name: {
          [Op.like]: `%${dto.name}%`,
        },
      },
    });
    if (hasEuloger) {
      throw new HttpException(
        "مداحی با این مشخصات وجود دارد",
        HttpStatus.CONFLICT,
      );
    }
    let fileName = "No photo";
    if (image) {
      fileName = await this.fileService.createFile(
        image,
        FileType.EULOGER_AVATARS,
      );
    }
    const euloger = await this.eulogerRepository.create({
      ...dto,
      image: fileName,
    });
    return euloger;
  }

  async getAllEulogers(): Promise<Eulogers[]> {
    const eulogers = await this.eulogerRepository.findAll({
      include: {all: true},
    });
    return eulogers;
  }

  async getOneEulogerById(value: number): Promise<Eulogers> {
    const euloger = await this.eulogerRepository.findOne({
      where: {id: value},
    });
    return euloger;
  }

  async searchByName(name: string): Promise<Eulogers[]> {
    return this.eulogerRepository.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });
  }

  async deleteEuloger(eulogerId: number): Promise<void> {
    this.eulogerRepository.destroy({
      where: {
        id: eulogerId,
      },
    });
  }
}
