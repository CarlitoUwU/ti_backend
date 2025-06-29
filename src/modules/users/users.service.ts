import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { UserProfilesService } from '../user_profiles/user_profiles.service';
import { UserBaseDto } from './dto';
import * as bcrypt from 'bcrypt';
import { parse } from 'path';
import { DateService } from '../../common/services/date.service';
import { MailsService } from '../mails/mails.service';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class UsersService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userProfilesService: UserProfilesService,
    private readonly dateService: DateService,
    private readonly mailsService: MailsService,
    private readonly redisService: RedisService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prismaService.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(`Email '${createUserDto.email}' is already in use`);
    }

    const salt = parseInt(process.env.BCRYPT_SALT || '10', 10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.prismaService.users.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: hashedPassword,
        district_id: createUserDto.district_id,
        is_active: createUserDto.is_active,
        created_at: this.dateService.getCurrentPeruDate(),
        updated_at: this.dateService.getCurrentPeruDate(),
        last_login: this.dateService.getCurrentPeruDate(),
      },
    });

    const userProfile = await this.userProfilesService.create(user.id, {
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      tastes: createUserDto.taste,
      is_active: createUserDto.is_active ?? true,
    });

    const district = await this.prismaService.districts.findUnique({
      where: { id: createUserDto.district_id },
      select: {
        id: true,
        name: true,
        fee_kwh: true,
        is_active: true,
      }
    });

    return this.toUserDto({
      ...user,
      user_profiles: { ...userProfile },
      districts: { ...district },
    });
  }

  async findAll() {
    const users = await this.prismaService.users.findMany({
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    if (!users || users.length === 0) {
      return [];
    }

    return users.map(user => this.toUserDto(user));
  }

  async findOne(id: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id },
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    return this.toUserDto(user);
  }

  async desactivate(id: string) {
    const existingUser = await this.prismaService.users.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }
    const user = await this.prismaService.users.update({
      where: { id },
      data: {
        is_active: false,
        updated_at: this.dateService.getCurrentPeruDate(),
      },
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    return this.toUserDto(user);
  }

  async activate(id: string) {
    const existingUser = await this.prismaService.users.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    const user = await this.prismaService.users.update({
      where: { id },
      data: {
        is_active: true,
        updated_at: this.dateService.getCurrentPeruDate(),
      },
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    return this.toUserDto(user);
  }

  async remove(id: string) {
    const existingUser = await this.prismaService.users.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id '${id}' not found`);
    }

    const user = await this.prismaService.users.delete({
      where: { id },
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    return this.toUserDto(user);
  }

  async login(email: string, password: string) {
    const user = await this.prismaService.users.findUnique({
      where: { email },
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    // Update last login time
    await this.prismaService.users.update({
      where: { id: user.id },
      data: { last_login: this.dateService.getCurrentPeruDate() },
    });

    return this.toUserDto(user);
  }

  private toUserDto(data: any): UserBaseDto {
    console.log('Converting user data to UserBaseDto:', data);
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      is_active: data.is_active,
      user_profile: {
        first_name: data.user_profiles.first_name,
        last_name: data.user_profiles.last_name,
        tastes: data.user_profiles.tastes,
        streak: data.user_profiles.streak,
      },
      district: {
        id: data.districts.id,
        name: data.districts.name,
        fee_kwh: data.districts.fee_kwh,
        is_active: data.districts.is_active,
      },
    };
  }

  async createCodeResetPassword(email: string) {
    const user = await this.prismaService.users.findUnique({
      where: { email },
      select: {
        username: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    // Generar código y guardarlo en Redis
    const resetCode = await this.redisService.generateResetCode(email);

    // Enviar email con el código
    await this.mailsService.sendUserResetPassword(user.username, email, parseInt(resetCode));

    return {
      message: 'Reset password code sent successfully',
      email: email,
      expiresIn: '10 minutes'
    };
  }

  async verifyResetCode(email: string, code: number) {
    const user = await this.prismaService.users.findUnique({
      where: { email },
      select: {
        username: true,
      }
    });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    // Verificar código en Redis
    const isValid = await this.redisService.verifyResetCode(email, code.toString());

    if (!isValid) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    return {
      message: 'Reset code verified successfully',
      email: email,
      verified: true,
      validFor: '30 minutes'
    };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    // Verificar que el usuario haya verificado su código recientemente
    const isCodeVerified = await this.redisService.isResetCodeVerified(email);

    if (!isCodeVerified) {
      throw new BadRequestException(
        'You must verify your reset code before changing your password. Please request a new reset code.'
      );
    }

    const salt = parseInt(process.env.BCRYPT_SALT || '10', 10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await this.prismaService.users.update({
      where: { email },
      data: {
        password: hashedPassword,
        updated_at: this.dateService.getCurrentPeruDate(),
      },
      include: {
        user_profiles: true,
        districts: true,
      },
    });

    // Limpiar la verificación de Redis después del reseteo exitoso
    await this.redisService.clearResetVerification(email);

    return {
      message: 'Password reset successfully',
      email: email,
      user: this.toUserDto(updatedUser)
    };
  }

}
