import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly publicPaths = [
    '/',
    '/doc',
    '/doc/',
    '/auth/login',
    '/auth/signup',
    '/auth/refresh',
  ];

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {
    console.log('[JwtAuthGuard] Guard instantiated');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('[JwtAuthGuard] canActivate called');
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.url.split('?')[0]; // Remove query parameters
    console.log(`[JwtAuthGuard] Checking path: ${path}`);

    if (
      this.publicPaths.some(
        (publicPath) => path === publicPath || path.startsWith('/doc'),
      )
    ) {
      console.log(`[JwtAuthGuard] Path ${path} is public, allowing access`);
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log(`[JwtAuthGuard] Route is marked as public, allowing access`);
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log(
        `[JwtAuthGuard] No token found, throwing UnauthorizedException`,
      );
      throw new UnauthorizedException('Authorization header is missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      if (!payload.userId || !payload.login) {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = {
        userId: payload.userId,
        login: payload.login,
        sub: payload.sub,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
