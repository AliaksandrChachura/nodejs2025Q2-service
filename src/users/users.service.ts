import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => ({
      id: user.id,
      login: user.login,
      password: user.password,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      login: user.login,
      password: user.password,
      version: user.version,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // async findByLogin(login: string): Promise<User | null> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { login },
  //   });

  //   if (!user) {
  //     return null;
  //   }

  //   return {
  //     id: user.id,
  //     login: user.login,
  //     password: user.password,
  //     version: user.version,
  //     createdAt: user.createdAt,
  //     updatedAt: user.updatedAt,
  //   };
  // }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        login: user.login,
        password: user.password,
        version: user.version,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return {
      id: createdUser.id,
      login: createdUser.login,
      password: createdUser.password,
      version: createdUser.version,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };
  }

  async update(id: string, user: User): Promise<User> {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        login: user.login,
        password: user.password,
        version: user.version,
        updatedAt: currentTimestamp,
      },
    });

    return {
      id: updatedUser.id,
      login: updatedUser.login,
      password: updatedUser.password,
      version: updatedUser.version,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
