import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { PrismaService } from '../prisma/prisma.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loggingService: LoggingService,
  ) {}

  async findAll(): Promise<User[]> {
    this.loggingService.debug('Fetching all users', 'UsersService');
    const users = await this.prisma.user.findMany();
    this.loggingService.verbose(`Found ${users.length} users`, 'UsersService');
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
    this.loggingService.debug(`Fetching user with id: ${id}`, 'UsersService');
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      this.loggingService.warn(`User not found with id: ${id}`, 'UsersService');
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

  async create(user: User): Promise<User> {
    this.loggingService.log(`Creating new user: ${user.login}`, 'UsersService');
    try {
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

      this.loggingService.log(`User created successfully: ${createdUser.id}`, 'UsersService');
      return {
        id: createdUser.id,
        login: createdUser.login,
        password: createdUser.password,
        version: createdUser.version,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      };
    } catch (error) {
      this.loggingService.error(`Failed to create user: ${error.message}`, 'UsersService');
      throw error;
    }
  }

  async update(id: string, user: User): Promise<User> {
    // Get the existing user to ensure updatedAt is different from createdAt
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });
    
  
    let newUpdatedAt = Math.floor(Date.now() / 1000);

    if (existingUser && newUpdatedAt === existingUser.createdAt) {
      newUpdatedAt = existingUser.createdAt + 1;
    }
    
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        login: user.login,
        password: user.password,
        version: user.version,
        updatedAt: newUpdatedAt,
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
    this.loggingService.log(`Deleting user with id: ${id}`, 'UsersService');
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      this.loggingService.log(`User deleted successfully: ${id}`, 'UsersService');
    } catch (error) {
      this.loggingService.error(`Failed to delete user: ${error.message}`, 'UsersService');
      throw error;
    }
  }
}
