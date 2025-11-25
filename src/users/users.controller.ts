import { Controller, Get, HttpCode, Post, Header, Param, Put, Delete } from '@nestjs/common';
import type { User } from './types';
import { generateUuid } from '../helpers/utils';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Controller('user')
export class UsersController {
  @Get()
  @Header('Accept', 'application/json')
  @HttpCode(200)
  async getUsers(): Promise<User[]> {
    return [
      {
        id: '1',
        login: 'test',
        password: 'test',
        version: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    ];
  }

  @Get(':id')
  @Header('Accept', 'application/json')
  @HttpCode(200)
  async getUserById(@Param('id') id: string): Promise<User> {
    return {
      id,
      login: 'test',
      password: 'test',
      version: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  @Post()
  @Header('Accept', 'application/json')
  @HttpCode(201)
  create(createUserDto: CreateUserDto): User {
    return {
      id: generateUuid(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  @Put(':id')
  @Header('Accept', 'application/json')
  @HttpCode(200)
  updateUserById(@Param('id') id: string, updateUserDto: UpdateUserDto): User {
    return {
      id,
      login: 'test',
      password: updateUserDto.newPassword,
      version: 1,
      createdAt: 1,
      updatedAt: 1,
    };
  }

  @Delete(':id')
  @Header('Accept', 'application/json')
  @HttpCode(204)
  deleteUserById(@Param('id') id: string): void {
    return;
  }
}