import {
  Controller,
  Get,
  HttpCode,
  Post,
  Header,
  Param,
  Put,
  Delete,
  Body,
  HttpException,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { User } from './interfaces/user.interface';
import { generateUuid } from '../helpers/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ErrorMessage, HttpStatus } from '../helpers/constants';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Header('Accept', 'application/json')
  @HttpCode(200)
  async getUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @Header('Accept', 'application/json')
  @HttpCode(200)
  async getUserById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new HttpException(ErrorMessage.UserNotFound, HttpStatus.NOT_FOUND);
    }

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post()
  @Header('Accept', 'application/json')
  @HttpCode(201)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.create({
      id: generateUuid(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Put(':id')
  @Header('Accept', 'application/json')
  @HttpCode(200)
  async updateUserById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersService.findById(id);

    if (!existingUser) {
      throw new HttpException(ErrorMessage.UserNotFound, HttpStatus.NOT_FOUND);
    }

    if (existingUser.password !== updateUserDto.oldPassword) {
      throw new HttpException(
        ErrorMessage.InvalidPassword,
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedUser = await this.usersService.update(id, {
      id,
      login: existingUser.login,
      password: updateUserDto.newPassword,
      version: existingUser.version + 1,
      createdAt: existingUser.createdAt,
      updatedAt: Date.now(),
    });

    const { password: _password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  @Delete(':id')
  @Header('Accept', 'application/json')
  @HttpCode(204)
  async deleteUserById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<void> {
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new HttpException(ErrorMessage.UserNotFound, HttpStatus.NOT_FOUND);
    }

    await this.usersService.delete(id);
  }
}
