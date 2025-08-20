import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from './generics/generic-response.dto';
import { User } from 'src/main/entities/user.entity';

export class FeatureResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdBy: Partial<User>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export type FeatureResponseWrapper = GenericResponseDto<FeatureResponseDto>;
export type FeaturesResponseWrapper = GenericResponseDto<FeatureResponseDto[]>;