import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { genSalt, hash, compare } from 'bcryptjs';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CreateTokenDto } from './dto/create-token.dto';
import { ResultData } from '../common/utils/result';
import { AppHttpCode } from '../common/enums/code.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @InjectEntityManager()
    private readonly userManager: EntityManager,
  ) {}

  /**
   * 新增用户
   * @param createUserDto 账号密码
   * @returns
   */
  async create(createUserDto: CreateUserDto) {
    if (await this.findOneByAccount(createUserDto.username))
      return ResultData.fail(
        AppHttpCode.USER_CREATE_EXISTING,
        '帐号已存在，请调整后重新注册！',
      );

    const salt = await genSalt();
    createUserDto.password = await hash(createUserDto.password, salt);
    // plainToInstance  忽略转换 @Exclude 装饰器
    const user = plainToInstance(
      User,
      { salt, ...createUserDto },
      { ignoreDecorators: true },
    );
    const result = await this.userManager.transaction(
      async (transactionalEntityManager) => {
        return await transactionalEntityManager.save<User>(user);
      },
    );
    return ResultData.ok(instanceToPlain(result));
  }

  /**
   * 登录
   * @param username 账号
   * @param password 密码
   * @returns
   */
  async login(username: string, password: string): Promise<ResultData> {
    if (!username || !password)
      return ResultData.fail(
        AppHttpCode.USER_PASSWORD_INVALID,
        '帐号或密码不能为空',
      );
    let user = null;

    user = await this.findOneByAccount(username);
    if (!user)
      return ResultData.fail(
        AppHttpCode.USER_PASSWORD_INVALID,
        '帐号或密码错误',
      );
    const checkPassword = await compare(password, user.password);
    if (!checkPassword)
      return ResultData.fail(
        AppHttpCode.USER_PASSWORD_INVALID,
        '帐号或密码错误',
      );
    // 生成 token
    const data = this.genToken({ id: user.id });
    return ResultData.ok(data);
  }

  async updateToken(userId: string): Promise<ResultData> {
    const data = this.genToken({ id: userId });
    return ResultData.ok(data);
  }

  async findOneByAccount(username: string): Promise<User> {
    return await this.user.findOne({ where: { username } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.user.update(id, updateUserDto);
  }

  /**
   * 生成 token 与 刷新 token
   * @param payload
   * @returns
   */
  genToken(payload: { id: string }): CreateTokenDto {
    const accessToken = `Bearer ${this.jwtService.sign(payload)}`;
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.config.get('jwt.refreshExpiresIn'),
    });
    return { accessToken, refreshToken };
  }

  /**
   * 生成刷新 token
   */
  refreshToken(id: string): string {
    return this.jwtService.sign({ id });
  }

  /** 校验 token */
  verifyToken(token: string): string {
    try {
      if (!token) return null;
      const id = this.jwtService.verify(token.replace('Bearer ', ''));
      return id;
    } catch (error) {
      return null;
    }
  }
}
