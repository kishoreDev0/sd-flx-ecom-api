// controller/static.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { StaticService } from '../service/static.service';
import { CreateStaticDTO } from '../dto/requests/static/create-static.dto';
import { UpdateStaticDTO } from '../dto/requests/static/update-static.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { StaticResponseDto } from '../dto/responses/static-response.dto';

@ApiTags('static-pages')
@Controller('v1/statics')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Static page created', type: StaticResponseDto })
  async create(@Body() dto: CreateStaticDTO) {
    const result = await this.staticService.create(dto);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Static page created successfully',
      data: result,
    };
  }

  @Get()
  @ApiResponse({ status: 200, description: 'All static pages', type: [StaticResponseDto] })
  async findAll() {
    const result = await this.staticService.findAll();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Static pages fetched successfully',
      data: result,
    };
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Single static page', type: StaticResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.staticService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Static page fetched successfully',
      data: result,
    };
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Static page updated', type: StaticResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStaticDTO) {
    const result = await this.staticService.update(id, dto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Static page updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Static page deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.staticService.remove(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Static page deleted successfully',
    };
  }
}
