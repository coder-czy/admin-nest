import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NestFactory } from '@nestjs/core';

import { UserService } from '../user/user.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../app.module';
/**
 * @guard文件作用:守卫
 */

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    // private readonly userService: UserService, // private readonly authService: AuthService,
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('进入全局守卫');
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    /**
     * @如果白名单数组中存在路径
     */

    if (this.hasUrl(this.urlList, req.path)) return true;

    try {
      // 获取token
      const accessToken = req.get('Authorization');
      if (!accessToken) throw new ForbiddenException('请先登录');
      // 获取id
      // @ts-ignore
      const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        // logger: true,
      });
      // const authService = app.get(AuthService);
      const userService = app.get(UserService);
      // const user = await authService.verifyToken(accessToken);
      const atUserId = await userService.verifyToken(accessToken);

      if (!atUserId)
        throw new UnauthorizedException('当前登录已过期，请重新登录');

      // if (Object.keys(user).length > 0) {
      //   const resData = await userService.findOneByAccount(user.sub);
      //   if (resData.code === 200) return true;
      // }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  // 白名单数组
  private urlList: string[] = ['/api/login', '/api/qrcode/one'];

  // 验证该次请求是否为白名单内的路由
  private hasUrl(urlList: string[], url: string): boolean {
    let flag = false;
    url = url?.split('?')[0];
    if (urlList.includes(url)) {
      flag = true;
    }
    return flag;
  }
}
