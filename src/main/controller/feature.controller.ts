// src/controller/feature.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { FeatureService } from '../service/feature.service';
import { CreateFeatureDTO } from '../dto/requests/feature/create-feature.dto';
import { UpdateFeatureDTO } from '../dto/requests/feature/update-feature.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { FeaturesResponseWrapper, FeatureResponseWrapper, FeatureResponseDto } from '../dto/responses/feature.response.dto';


@Controller('v1/features')
@ApiTags('Features')
// @UseGuards(AuthGuard)
// @ApiHeadersForAuth()
export class FeatureController {
  constructor(private readonly service: FeatureService) {}
  
  @Post()
  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  @ApiOperation({ summary: 'Create a new feature' })
  @ApiResponse({ status: 201, description: 'Feature created', type: FeatureResponseDto })
  create(@Body() createFeatureDto: CreateFeatureDTO) {
  return this.service.create(createFeatureDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update feature by ID' })
  @ApiResponse({ status: 200, description: 'Feature updated', type: FeatureResponseDto })
  async update(@Param('id') id: number, @Body() dto: UpdateFeatureDTO) {
    try{
          const response = await this.service.update(id, dto);
          return response;

    }catch(error){
       console.log(error  )
    }
  }
  @Get()
  @ApiOperation({ summary: 'Get all features' })
  @ApiResponse({ status: 200, description: 'Features fetched', type: [FeatureResponseDto] })
  async findAll(): Promise<FeaturesResponseWrapper> {
      return this.service.getAllFeatures();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get feature by ID' })
  @ApiResponse({ status: 200, description: 'Feature found', type: FeatureResponseDto })
  async findOne(@Param('id') id: number): Promise<FeatureResponseWrapper> {
    return this.service.getById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete feature by ID' })
  @ApiResponse({ status: 200, description: 'Feature deleted' })
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }

  

}
