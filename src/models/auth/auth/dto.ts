import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    example: 'dayone',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'password must be at least 8 characters long, contain uppercase, lowercase, number, and special character',
  })
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lat?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  long?: string;
}

export class UserResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  email?: string;

  @Expose()
  @ApiProperty()
  require_password_change: boolean;

  @Expose()
  @ApiProperty()
  is_active: boolean;

  @Expose()
  @ApiProperty()
  is_suspended: boolean;

  @Expose()
  @ApiProperty()
  username_verified: boolean;

  @Expose()
  @ApiProperty()
  userRoles?: any[];

  @Expose()
  @ApiProperty()
  server_time?: Date;

  // Explicitly exclude sensitive fields
  @Exclude()
  password: string;

  @Exclude()
  code_hash: string;

  @Exclude()
  code_expiration: Date;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
