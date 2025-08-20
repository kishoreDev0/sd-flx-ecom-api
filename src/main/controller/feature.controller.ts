// src/controller/feature.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { FeatureService } from '../service/feature.service';
import { CreateFeatureDTO } from '../dto/requests/feature/create-feature.dto';
import { UpdateFeatureDTO } from '../dto/requests/feature/update-feature.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { FeaturesResponseWrapper } from '../dto/responses/feature.response.dto';


@Controller('v1/features')
@ApiTags('Features')
// @UseGuards(AuthGuard)
// @ApiHeadersForAuth()
export class FeatureController {
  constructor(private readonly service: FeatureService) {}
  
  @Post()
  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  create(@Body() createFeatureDto: CreateFeatureDTO) {
  return this.service.create(createFeatureDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateFeatureDTO) {
    try{
          const response = await this.service.update(id, dto);
          return response;

    }catch(error){
       console.log(error  )
    }
  }
  @Get()
  async findAll(): Promise<FeaturesResponseWrapper> {
      return this.service.getAllFeatures();
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }

  

}
