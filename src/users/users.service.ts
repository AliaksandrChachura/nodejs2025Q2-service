import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UpdatePasswordDto } from './interfaces/update-password.interface';

@Injectable()
export class UsersService {
  private users: Map<string, User> = new Map();

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async findById(id: string): Promise<User> {
    return this.users.get(id);
  }

  async create(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, user: User): Promise<User> {
    this.users.set(id, user);
    return user;
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}