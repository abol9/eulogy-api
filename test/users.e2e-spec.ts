import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import * as request from "supertest";
import {UsersService} from "../src/users/users.service";
import {UsersModule} from "../src/users/users.module";

describe("UsersController E2E Test", () => {
  let app: INestApplication;
  const usersService = {findAll: () => ["test"]};
  jest.useFakeTimers();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  describe("Get Users GET /users", () => {
    const GET_USERS_URL = "/users";

    it("/GET users", () => {
      return request(app.getHttpServer()).get(GET_USERS_URL).expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
