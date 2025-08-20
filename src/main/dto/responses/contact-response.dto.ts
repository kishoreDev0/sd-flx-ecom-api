import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from './generics/generic-response.dto';
import { User } from 'src/main/entities/user.entity';
import { Order } from 'src/main/entities/order.entity';

export class ContactResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  queryOn: string;

  @ApiProperty({ required: false })
  orderId?: Order;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdBy: Partial<User>;

  @ApiProperty({ required: false })
  updatedBy?: Partial<User>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}


export type ContactResponseWrapper = GenericResponseDto<ContactResponseDto>;
export type ContactsResponseWrapper = GenericResponseDto<ContactResponseDto[]>;