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
import * as bcrypt from 'bcrypt';
import type { User } from './interfaces/user.interface';
import { generateUuid } from '../helpers/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';
import { ErrorMessage, HttpStatus } from '../helpers/constants';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: [UserResponseDto],
  })
  @Header('Accept', 'application/json')
  @HttpCode(200)
  async getUsers(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidUserId,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.UserNotFound,
  })
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
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'Successful operation',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidRequestBody,
  })
  @Header('Accept', 'application/json')
  @HttpCode(201)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const user = await this.usersService.create({
      id: generateUuid(),
      login: createUserDto.login,
      password: hashedPassword,
      version: 1,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    });

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidUserId,
  })
  @ApiResponse({
    status: 403,
    description: ErrorMessage.InvalidPassword,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.UserNotFound,
  })
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

    // Compare the provided old password with the hashed password
    const isOldPasswordValid = await bcrypt.compare(
      updateUserDto.oldPassword,
      existingUser.password,
    );
    if (!isOldPasswordValid) {
      throw new HttpException(
        ErrorMessage.InvalidPassword,
        HttpStatus.FORBIDDEN,
      );
    }

    // Hash the new password before storing
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(
      updateUserDto.newPassword,
      saltRounds,
    );

    const updatedUser = await this.usersService.update(id, {
      id,
      login: existingUser.login,
      password: hashedNewPassword,
      version: existingUser.version + 1,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt, // Will be overridden by service with current timestamp
    });

    const { password: _password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({
    status: 204,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: 400,
    description: ErrorMessage.InvalidUserId,
  })
  @ApiResponse({
    status: 404,
    description: ErrorMessage.UserNotFound,
  })
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
