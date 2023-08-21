import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Roles} from "../auth/roles-auth.decorator";
import {RolesGuard} from "../auth/roles.guard";
import {FollowService} from "./follow.service";
import {FollowCreateDto} from "./dto/follow-create.dto";

@ApiTags("اشتراک مداحان، مداحی ها")
@Controller("follow")
export class FollowController {
  constructor(private followService: FollowService) {}

  @ApiOperation({summary: "دنبال کردن یک مداح"})
  @ApiResponse({status: 200, type: FollowCreateDto})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Post("/subscription")
  createSubscription(
    @Body() dto: FollowCreateDto,
    @Req() request,
  ): Promise<FollowCreateDto> {
    return this.followService.createSubscription(dto, request.user.id);
  }

  @ApiOperation({summary: "آنفالو کردن یک مداح"})
  @ApiResponse({status: 204})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Delete("/subscription")
  @HttpCode(204)
  removeSubscription(
    @Body() dto: FollowCreateDto,
    @Req() request,
  ): Promise<void> {
    return this.followService.removeSubscription(dto, request.user.id);
  }

  @ApiOperation({summary: "اضافه کردن مداحی به علاقه مندی"})
  @ApiResponse({status: 200, type: FollowCreateDto})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Post("/likes")
  createLikes(
    @Body() dto: FollowCreateDto,
    @Req() request,
  ): Promise<FollowCreateDto> {
    return this.followService.createLikes(dto, request.user.id);
  }

  @ApiOperation({summary: "حذف کردن مداحی از علاقه مندی ها"})
  @ApiResponse({status: 204})
  @Roles("USER")
  @UseGuards(RolesGuard)
  @Delete("/likes")
  @HttpCode(204)
  removeLikes(@Body() dto: FollowCreateDto, @Req() request): Promise<void> {
    return this.followService.removeLikes(dto, request.user.id);
  }
}
