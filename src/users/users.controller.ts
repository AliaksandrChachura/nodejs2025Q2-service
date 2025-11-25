import { Controller, Get, HttpCode, Post, Header, Param, Put, Delete, InternalServerErrorException } from '@nestjs/common';
import type { User } from './types';
import { generateUuid } from '../helpers/utils';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Header('Accept', 'application/json')
  @HttpCode(200)
  async getUsers(): Promise<User[]> {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get users');
    }
  }

  @Get(':id')
  @Header('Accept', 'application/json')
  @HttpCode(200)
  async getUserById(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.findById(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to get user by id');
    }
  }

  @Post()
  @Header('Accept', 'application/json')
  @HttpCode(201)
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create({
        id: generateUuid(),
        login: createUserDto.login,
        password: createUserDto.password,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @Put(':id')
  @Header('Accept', 'application/json')
  @HttpCode(200)
  async updateUserById(@Param('id') id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.usersService.update(id, {
        id,
        login: 'test',
        password: updateUserDto.newPassword,
        version: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  @Delete(':id')
  @Header('Accept', 'application/json')
  @HttpCode(204)
  async deleteUserById(@Param('id') id: string): Promise<void> {
    try {
      await this.usersService.delete(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
    return;
  }
}