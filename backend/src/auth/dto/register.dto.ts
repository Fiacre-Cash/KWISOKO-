import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+250780123456' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'StrongPass@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Alice' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Uwase' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ enum: Role, default: Role.BUYER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
