import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsArray, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShippingMethodType, CarrierType } from '../../../entities/shipping.entity';

export class CreateShippingAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiProperty()
  @IsNumber()
  userId: number;
}

export class UpdateShippingAddressDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  addressType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  addressLine1?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instructions?: string;
}

export class CreateShippingMethodDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ShippingMethodType })
  @IsEnum(ShippingMethodType)
  @IsNotEmpty()
  methodType: ShippingMethodType;

  @ApiProperty()
  @IsNumber()
  basePrice: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  additionalPrice?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  minDeliveryDays?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  maxDeliveryDays?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  restrictions?: {
    maxWeight?: number;
    maxDimensions?: string;
    excludedRegions?: string[];
    includedRegions?: string[];
  };
}

export class CreateShippingZoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  countries: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  states?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  postalCodes?: string[];

  @ApiProperty()
  @IsNumber()
  baseShippingCost: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  additionalItemCost?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateShipmentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({ enum: CarrierType })
  @IsEnum(CarrierType)
  @IsNotEmpty()
  carrier: CarrierType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  trackingUrl?: string;

  @ApiProperty({ enum: ShippingMethodType })
  @IsEnum(ShippingMethodType)
  @IsNotEmpty()
  shippingMethod: ShippingMethodType;

  @ApiProperty()
  @IsNumber()
  shippingCost: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationAddress: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  weightUnit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  packageType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  deliveryNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: {
    insuranceAmount?: number;
    signatureRequired?: boolean;
    fragile?: boolean;
    [key: string]: any;
  };

  @ApiProperty()
  @IsNumber()
  createdById: number;
}

export class UpdateShipmentStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  trackingUrl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  deliveryNotes?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  failureReason?: string;

  @ApiProperty()
  @IsNumber()
  updatedById: number;
}

export class CalculateShippingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationCountry: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationState?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationPostalCode?: string;

  @ApiProperty()
  @IsNumber()
  totalWeight: number;

  @ApiProperty()
  @IsNumber()
  itemCount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shippingMethod?: string;
}
