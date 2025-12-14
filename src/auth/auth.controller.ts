import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Header,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { AuthedUserDto } from './dto/authed-user.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Header('Content-Type', 'application/json')
  async login(@Body() loginDto: LoginDto): Promise<AuthedUserDto> {
    return this.authService.signIn(loginDto.login, loginDto.password);
  }

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  @Header('Content-Type', 'application/json')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.createUser({
      login: signupDto.login,
      password: signupDto.password,
    });
  }

  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @Header('Content-Type', 'application/json')
  async refresh(
    @Body() refreshTokenDto: CreateRefreshTokenDto,
  ): Promise<AuthedUserDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
