import {
  Injectable,
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';
import { generateUuid } from '../helpers/utils';
import { AuthedUserDto } from './dto/authed-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly loggingService: LoggingService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<{
    id: string;
    login: string;
    version: number;
    createdAt: number;
    updatedAt: number;
  }> {
    this.loggingService.log(
      `Signing up user: ${createUserDto.login}`,
      'AuthService',
    );
    const { login, password } = createUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: { login },
    });

    if (existingUser) {
      this.loggingService.warn(
        `User with login already exists: ${createUserDto.login}`,
        'AuthService',
      );
      throw new ConflictException('User with this login already exists');
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const userId = generateUuid();

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
      const user = await this.prisma.user.create({
        data: {
          id: userId,
          login: createUserDto.login,
          password: hashedPassword,
          version: 1,
          createdAt: currentTimestamp,
          updatedAt: currentTimestamp,
        },
      });

      this.loggingService.log(
        `User created successfully: ${user.id}`,
        'AuthService',
      );

      return {
        id: user.id,
        login: user.login,
        version: user.version,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      this.loggingService.error(
        `Failed to create user: ${error instanceof Error ? error.message : String(error)}`,
        'AuthService',
      );
      throw error;
    }
  }

  async signIn(login: string, password: string): Promise<AuthedUserDto> {
    this.loggingService.log(`Signing in user: ${login}`, 'AuthService');

    const user = await this.prisma.user.findFirst({
      where: { login },
    });

    if (!user) {
      this.loggingService.warn(`User not found: ${login}`, 'AuthService');
      throw new ForbiddenException('Invalid login or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.loggingService.warn(
        `Invalid password for user: ${login}. Password comparison failed.`,
        'AuthService',
      );
      throw new ForbiddenException('Invalid login or password');
    }

    const payload = {
      userId: user.id,
      login: user.login,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY || process.env.JWT_SECRET_KEY,
      expiresIn: '7d',
    });

    this.loggingService.log(
      `Access token and refresh token generated for user: ${login}`,
      'AuthService',
    );

    return {
      login: user.login,
      userId: user.id,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthedUserDto> {
    this.loggingService.log('Refreshing token', 'AuthService');

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret:
            process.env.JWT_SECRET_REFRESH_KEY || process.env.JWT_SECRET_KEY,
        },
      );

      if (!payload.userId || !payload.login) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const user = await this.prisma.user.findFirst({
        where: { id: payload.userId, login: payload.login },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = {
        userId: user.id,
        login: user.login,
        sub: user.id,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: '1h',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret:
          process.env.JWT_SECRET_REFRESH_KEY || process.env.JWT_SECRET_KEY,
        expiresIn: '7d',
      });

      this.loggingService.log(
        `Tokens refreshed for user: ${user.login}`,
        'AuthService',
      );

      return {
        login: user.login,
        userId: user.id,
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      this.loggingService.warn('Token refresh failed', 'AuthService');
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
