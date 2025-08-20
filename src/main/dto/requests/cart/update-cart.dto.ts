  import { ApiProperty } from '@nestjs/swagger';
  import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

  export class UpdateCartDTO {
    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    productIds?: number[];

    @ApiProperty()
    @IsNumber()
    updatedBy: number;
  }

  export class UpdateCartListDTO {
    @ApiProperty()
    @IsNumber()
    productId: number;

    @ApiProperty()
    @IsNumber()
    updatedBy: number;
  }
