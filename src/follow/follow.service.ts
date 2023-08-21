import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Eulogers} from "../eulogers/eulogers.model";
import {Eulogy} from "../eulogies/eulogy.model";
import {RolesService} from "../roles/roles.service";
import {FollowCreateDto} from "./dto/follow-create.dto";
import {Likes} from "./likes.model";
import {Subscriptions} from "./subscription.model";

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Eulogers) private eulogerRepository: typeof Eulogers,
    @InjectModel(Eulogy) private eulogyRepository: typeof Eulogy,
    @InjectModel(Likes) private likesRepository: typeof Likes,
    @InjectModel(Subscriptions) private subsRepository: typeof Subscriptions,
    private roleService: RolesService,
  ) {}

  async createSubscription(
    dto: FollowCreateDto,
    userId: number,
  ): Promise<FollowCreateDto> {
    const user = await this.userRepository.findByPk(userId);
    const musician = await this.eulogerRepository.findByPk(dto.followId);
    if (user && musician) {
      await user.$add("eulogersSubscription", musician.id);
      return dto;
    }
    throw new HttpException("کاربر یا نوازنده یافت نشد", HttpStatus.NOT_FOUND);
  }

  async createLikes(
    dto: FollowCreateDto,
    userId: number,
  ): Promise<FollowCreateDto> {
    const user = await this.userRepository.findByPk(userId);
    const eulogy = await this.eulogyRepository.findByPk(dto.followId);
    if (user && eulogy) {
      await user.$add("eulogyLikes", eulogy.id);
      return dto;
    }
    throw new HttpException(
      "Пользователь или песня не найдены",
      HttpStatus.NOT_FOUND,
    );
  }

  async removeSubscription(
    dto: FollowCreateDto,
    userId: number,
  ): Promise<void> {
    await this.subsRepository.destroy({
      where: {
        userId: userId,
        eulogerId: dto.followId,
      },
    });
    return;
  }

  async removeLikes(dto: FollowCreateDto, userId: number): Promise<void> {
    await this.likesRepository.destroy({
      where: {
        userId: userId,
        eulogyId: dto.followId,
      },
    });
    return;
  }
}
