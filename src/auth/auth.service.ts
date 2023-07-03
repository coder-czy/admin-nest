import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @本地身份策略调用方法
   * @调用UserService里面的findUserName方法通过username找到用户
   * @param username
   * @param password
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.UserService.findOneByAccount(username);
    if (user[0] && user[0].password === password) {
      return user;
    }
    return null;
  }

  /**
   * @jwt认证登录
   * @param user
   */
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      code: 200,
      data: {
        id: user.id,
        username: user.username,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * @token验证方法
   * @param token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      if (!token) return false;
      const id = this.jwtService.verify(token.replace('Bearer ', ''));
      return id;
    } catch (e) {
      return false;
    }
  }
}
