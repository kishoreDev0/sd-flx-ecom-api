import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from './generics/generic-response.dto';
import { User } from 'src/main/entities/user.entity';

export class CartResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: Partial<User>;

  @ApiProperty()
  productIds: number[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdBy: Partial<User>;

  @ApiProperty()
  updatedBy: Partial<User>;
}

// Wrapper types
export type CartResponseWrapper = GenericResponseDto<CartResponseDto>;
export type CartsResponseWrapper = GenericResponseDto<CartResponseDto[]>;
