import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsString, IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from 'src/main/entities/order.entity';

export class UpdateOrderDTO {
  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  productIds?: number[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({ enum: OrderStatus, required: false })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty()
  @IsNumber()
  updatedBy: number;
}

export class UpdateOrderStatusDTO {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty()
  @IsNumber()
  updatedBy: number;
}