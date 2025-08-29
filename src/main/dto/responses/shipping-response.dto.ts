import { ApiProperty } from '@nestjs/swagger';
import { ShippingStatus, ShippingMethodType, CarrierType } from '../../entities/shipping.entity';

export class ShippingAddressResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  addressType: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  addressLine1: string;

  @ApiProperty({ required: false })
  addressLine2?: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  country: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty({ required: false })
  instructions?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ShippingMethodResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: ShippingMethodType })
  methodType: ShippingMethodType;

  @ApiProperty()
  basePrice: number;

  @ApiProperty()
  additionalPrice: number;

  @ApiProperty()
  minDeliveryDays: number;

  @ApiProperty()
  maxDeliveryDays: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ required: false })
  restrictions?: {
    maxWeight?: number;
    maxDimensions?: string;
    excludedRegions?: string[];
    includedRegions?: string[];
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ShippingZoneResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [String] })
  countries: string[];

  @ApiProperty({ type: [String], required: false })
  states?: string[];

  @ApiProperty({ type: [String], required: false })
  postalCodes?: string[];

  @ApiProperty()
  baseShippingCost: number;

  @ApiProperty()
  additionalItemCost: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ShipmentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  shipmentNumber: string;

  @ApiProperty()
  orderId: number;

  @ApiProperty({ enum: ShippingStatus })
  status: ShippingStatus;

  @ApiProperty({ enum: CarrierType })
  carrier: CarrierType;

  @ApiProperty({ required: false })
  trackingNumber?: string;

  @ApiProperty({ required: false })
  trackingUrl?: string;

  @ApiProperty({ enum: ShippingMethodType })
  shippingMethod: ShippingMethodType;

  @ApiProperty()
  shippingCost: number;

  @ApiProperty()
  originAddress: string;

  @ApiProperty()
  destinationAddress: string;

  @ApiProperty({ required: false })
  weight?: number;

  @ApiProperty({ required: false })
  weightUnit?: string;

  @ApiProperty({ required: false })
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };

  @ApiProperty({ required: false })
  packageType?: string;

  @ApiProperty({ required: false })
  shippedAt?: Date;

  @ApiProperty({ required: false })
  estimatedDeliveryDate?: Date;

  @ApiProperty({ required: false })
  deliveredAt?: Date;

  @ApiProperty({ required: false })
  deliveryNotes?: string;

  @ApiProperty({ required: false })
  failureReason?: string;

  @ApiProperty({ required: false })
  trackingHistory?: {
    timestamp: Date;
    status: string;
    location: string;
    description: string;
  }[];

  @ApiProperty({ required: false })
  metadata?: {
    insuranceAmount?: number;
    signatureRequired?: boolean;
    fragile?: boolean;
    [key: string]: any;
  };

  @ApiProperty()
  createdById: number;

  @ApiProperty({ required: false })
  updatedById?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Order details
  @ApiProperty({ required: false })
  order?: {
    id: number;
    orderNumber: string;
    totalAmount: number;
  };
}

export class ShippingTrackingResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  shipmentId: number;

  @ApiProperty({ required: false })
  trackingNumber?: string;

  @ApiProperty({ enum: ShippingStatus })
  status: ShippingStatus;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty({ required: false })
  metadata?: {
    latitude?: number;
    longitude?: number;
    facility?: string;
    [key: string]: any;
  };

  @ApiProperty()
  createdAt: Date;
}

export class ShippingCalculationResponseDto {
  @ApiProperty()
  destinationCountry: string;

  @ApiProperty({ required: false })
  destinationState?: string;

  @ApiProperty({ required: false })
  destinationPostalCode?: string;

  @ApiProperty()
  totalWeight: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty({ type: [Object] })
  availableMethods: {
    method: ShippingMethodType;
    cost: number;
    estimatedDays: number;
    description: string;
  }[];

  @ApiProperty()
  recommendedMethod: ShippingMethodType;

  @ApiProperty()
  totalShippingCost: number;
}

export class ShippingStatsDto {
  @ApiProperty()
  totalShipments: number;

  @ApiProperty()
  pendingShipments: number;

  @ApiProperty()
  shippedShipments: number;

  @ApiProperty()
  deliveredShipments: number;

  @ApiProperty()
  failedShipments: number;

  @ApiProperty()
  totalShippingCost: number;

  @ApiProperty({ type: [Object] })
  shipmentsByCarrier: {
    carrier: CarrierType;
    count: number;
    cost: number;
  }[];

  @ApiProperty({ type: [Object] })
  shipmentsByMethod: {
    method: ShippingMethodType;
    count: number;
    cost: number;
  }[];
}
