import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from './generics/generic-response.dto';
import { User } from 'src/main/entities/user.entity';
import { OrderStatus } from 'src/main/entities/order.entity';

export class OrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: Partial<User>;

  @ApiProperty()
  productIds: number[];

  @ApiProperty()
  totalAmount: number;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty()
  shippingAddress: string;

  @ApiProperty()
  notes: string;

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
export type OrderResponseWrapper = GenericResponseDto<OrderResponseDto>;
export type OrdersResponseWrapper = GenericResponseDto<OrderResponseDto[]>;
