import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";

export enum FileType {
  AUDIO = "audio",
  USERS_AVATARS = "users_avatars",
  EULOGER_AVATARS = "euloger_avatars",
  ALBUMS_IMAGE = "albums_image",
  PLAYLIST_IMAGE = "playlist_image",
  EULOGY_IMAGE = "eulogy_image",
}

@Injectable()
export class FilesService {
  async createFile(file, type: FileType): Promise<string> {
    try {
      const fileExtension = file.originalname.split(".").pop();
      const fileName = uuid.v4() + "." + fileExtension;
      const filePath = path.resolve(__dirname, "..", "static", type);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, {recursive: true});
      }

      fs.writeFileSync(path.join(filePath, fileName), file.buffer);

      return type + "/" + fileName;
    } catch (e) {
      throw new HttpException(
        "هنگام نوشتن فایل خطایی رخ داد",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async removeFile() {}
}
