import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsString} from 'class-validator';
import { Product } from 'src/main/entities/product.entity';

export class CreateOrderDTO {

  @ApiProperty()
  @IsArray()
  productQuantity:ProductQuantityItem[];
  
  @ApiProperty()
  @IsArray()
  products:Product[];

  @ApiProperty()
  @IsNumber()
  createdBy:number

  @ApiProperty()
  @IsString()
  address:string

  @ApiProperty()
  @IsString()
  notes:string
}

export class ProductQuantityItem {
  product_id: number;
  quantity: number;
}