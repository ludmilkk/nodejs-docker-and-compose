import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  ILike,
  QueryFailedError,
  Raw,
  Repository,
} from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CrudOptions, QueryFilter } from '../common/types/crud';
import { normalize } from '../common/utils/strings';
import { hashPassword } from '../common/helpers/security';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (
      await this.existsWithUsernameOrEmail(
        createUserDto.username,
        createUserDto.email,
      )
    ) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      username: createUserDto.username.trim(),
      email: createUserDto.email.trim(),
      password: await hashPassword(createUserDto.password),
    });

    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505')
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
      }
      throw error;
    }
  }

  async findOne(where: QueryFilter<User>, options: CrudOptions<User> = {}) {
    const { relations, select, withProtectedFields } = options;
    const builder = this.userRepository
      .createQueryBuilder('user')
      .setFindOptions({
        where,
        relations,
        select,
      });
    if (withProtectedFields) builder.addSelect('user.password');
    const user = await builder.getOne();
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async findMany(where: QueryFilter<User>, options: CrudOptions<User> = {}) {
    const { relations, select } = options;
    return this.userRepository.find({ where, relations, select });
  }

  async updateOne(where: QueryFilter<User>, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where,
    });
    if (!user) return null;
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async removeOne(where: QueryFilter<User>) {
    const user = await this.userRepository.findOne({
      where,
    });
    if (!user) return null;
    await this.userRepository.remove(user);
    return user;
  }

  async existsWithUsernameOrEmail(
    username: string,
    email: string,
    selfId: number | null = null,
  ) {
    const normalizedUsername = normalize(username);
    const normalizedEmail = normalize(email);
    const where: FindOptionsWhere<User>[] = [];
    if (normalizedUsername) {
      where.push({
        username: Raw((c) => `LOWER(${c}) = :normalizedUsername`, {
          normalizedUsername,
        }),
      });
    }
    if (normalizedEmail) {
      where.push({
        email: Raw((c) => `LOWER(${c}) = :normalizedEmail`, {
          normalizedEmail,
        }),
      });
    }
    if (!where.length) return false;
    if (selfId) {
      const users = await this.userRepository.find({
        where,
        select: { id: true },
      });
      return users.some((user) => user.id !== selfId);
    }
    return this.userRepository.exists({ where: where });
  }

  async findOneByUserId(userId: number) {
    return await this.findOne({ id: userId });
  }

  async findOneByUsername(username: string) {
    return await this.findOne(
      { username: username },
      { withProtectedFields: true },
    );
  }

  async findManyBySearchQuery(query: string) {
    const search_query = query?.trim();
    if (!search_query) return [];
    const pattern = `%${search_query.replace(
      /[%_\\]/g,
      (match) => '\\' + match,
    )}%`;
    return this.userRepository.find({
      where: [{ email: ILike(pattern) }, { username: ILike(pattern) }],
    });
  }

  async updateUserInfo(user: User, dto: UpdateUserDto) {
    if (
      (dto.username && dto.username != user.username) ||
      (dto.email && dto.email != user.email)
    ) {
      if (
        await this.existsWithUsernameOrEmail(dto.username, dto.email, user.id)
      ) {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
    }

    try {
      if (dto.email) user.email = dto.email.trim();
      if (dto.username) user.username = dto.username.trim();
      if (dto.about) user.about = dto.about;
      if (dto.avatar) user.avatar = dto.avatar;
      if (dto.password) {
        user.password = await hashPassword(dto.password);
      }

      return this.userRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.code === '23505') {
          throw new ConflictException(
            'Пользователь с таким email или username уже зарегистрирован',
          );
        }
      }
    }
  }
}
