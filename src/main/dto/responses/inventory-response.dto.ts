import { ApiProperty } from '@nestjs/swagger';

export class InventoryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  vendorId: number;

  @ApiProperty()
  currentStock: number;

  @ApiProperty()
  reservedStock: number;

  @ApiProperty()
  availableStock: number;

  @ApiProperty()
  lowStockThreshold: number;

  @ApiProperty()
  isLowStock: boolean;

  @ApiProperty()
  isOutOfStock: boolean;

  @ApiProperty({ required: false })
  lastStockUpdate?: Date;

  @ApiProperty({ required: false })
  lastLowStockAlert?: Date;

  @ApiProperty({ required: false })
  stockNotes?: string;

  @ApiProperty({ required: false })
  stockHistory?: {
    date: Date;
    quantity: number;
    type: 'in' | 'out' | 'adjustment';
    reason: string;
    reference?: string;
  }[];

  @ApiProperty()
  createdById: number;

  @ApiProperty({ required: false })
  updatedById?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Product details
  @ApiProperty({ required: false })
  product?: {
    id: number;
    name: string;
    price: number;
  };

  // Vendor details
  @ApiProperty({ required: false })
  vendor?: {
    id: number;
    vendorName: string;
  };
}
