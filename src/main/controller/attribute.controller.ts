import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AttributeService } from '../service/attribute.service';
import { CreateAttributeDto } from '../dto/requests/attribute/create-attribute.dto';
import { CreateAttributeValueDto } from '../dto/requests/attribute/create-attribute-value.dto';
import { CreateAttributeWithValuesDto } from '../dto/requests/attribute/create-attribute-with-values.dto';
import { 
  AttributeResponseDto, 
  AttributeResponseWrapper, 
  AttributesResponseWrapper 
} from '../dto/responses/attribute/attribute-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';

@ApiTags('Attributes')
@Controller('v1/attributes')
@UseGuards(AuthGuard)
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new attribute' })
  @ApiResponse({
    status: 201,
    description: 'Attribute created successfully',
    type: AttributeResponseWrapper,
  })
  @ApiResponse({ status: 400, description: 'Bad request - attribute name already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - provide valid user-id and access-token headers' })
  async createAttribute(
    @Body() createAttributeDto: CreateAttributeDto,
    @Request() req,
  ): Promise<AttributeResponseWrapper> {
    const userId = Number(req.headers['user-id']);
    const attribute = await this.attributeService.createAttribute({
      ...createAttributeDto,
      createdBy: userId,
    });
    
    return {
      success: true,
      message: 'Attribute created successfully',
      data: attribute,
      statusCode: 201,
    };
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create attribute with multiple values in one request' })
  @ApiResponse({
    status: 201,
    description: 'Attribute and values created successfully',
    type: AttributeResponseWrapper,
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid data or attribute name already exists' })
  async createAttributeWithValues(
    @Body() createAttributeWithValuesDto: CreateAttributeWithValuesDto,
    @Request() req,
  ): Promise<AttributeResponseWrapper> {
    const userId = Number(req.headers['user-id']);
    const attribute = await this.attributeService.createAttributeWithValues(createAttributeWithValuesDto, userId);
    
    return {
      success: true,
      message: 'Attribute and values created successfully',
      data: attribute,
      statusCode: 201,
    };
  }

  @Post('values')
  @ApiOperation({ summary: 'Create a new attribute value' })
  @ApiResponse({
    status: 201,
    description: 'Attribute value created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - value already exists for attribute' })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  async createAttributeValue(
    @Body() createAttributeValueDto: CreateAttributeValueDto,
    @Request() req,
  ) {
    const userId = Number(req.headers['user-id']);
    return this.attributeService.createAttributeValue({
      ...createAttributeValueDto,
      createdBy: userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all attributes' })
  @ApiResponse({
    status: 200,
    description: 'List of all attributes',
    type: AttributesResponseWrapper,
  })
  async getAllAttributes(): Promise<AttributesResponseWrapper> {
    const attributes = await this.attributeService.getAllAttributes();
    
    return {
      success: true,
      message: 'Attributes retrieved successfully',
      data: attributes,
      statusCode: 200,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attribute by ID' })
  @ApiResponse({
    status: 200,
    description: 'Attribute found',
    type: AttributeResponseWrapper,
  })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  async getAttributeById(@Param('id', ParseIntPipe) id: number): Promise<AttributeResponseWrapper> {
    const attribute = await this.attributeService.getAttributeById(id);
    
    return {
      success: true,
      message: 'Attribute retrieved successfully',
      data: attribute,
      statusCode: 200,
    };
  }

  @Get(':id/values')
  @ApiOperation({ summary: 'Get all values for a specific attribute' })
  @ApiResponse({
    status: 200,
    description: 'List of attribute values',
  })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  async getAttributeValues(@Param('id', ParseIntPipe) id: number) {
    return this.attributeService.getAttributeValuesByAttributeId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an attribute' })
  @ApiResponse({
    status: 200,
    description: 'Attribute updated successfully',
    type: AttributeResponseWrapper,
  })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  @ApiResponse({ status: 400, description: 'Bad request - attribute name already exists' })
  async updateAttribute(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateAttributeDto>,
    @Request() req,
  ): Promise<AttributeResponseWrapper> {
    const userId = Number(req.headers['user-id']);
    const attribute = await this.attributeService.updateAttribute(id, updateData, userId);
    
    return {
      success: true,
      message: 'Attribute updated successfully',
      data: attribute,
      statusCode: 200,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an attribute' })
  @ApiResponse({ status: 200, description: 'Attribute deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attribute not found' })
  @ApiResponse({ status: 400, description: 'Bad request - attribute is being used by products' })
  async deleteAttribute(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.attributeService.deleteAttribute(id);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get attributes by category' })
  @ApiResponse({
    status: 200,
    description: 'List of attributes for the category',
    type: AttributesResponseWrapper,
  })
  async getAttributesByCategory(@Param('categoryId', ParseIntPipe) categoryId: number): Promise<AttributesResponseWrapper> {
    const attributes = await this.attributeService.getAttributesByCategory(categoryId);
    
    return {
      success: true,
      message: 'Attributes retrieved successfully',
      data: attributes,
      statusCode: 200,
    };
  }

  @Get('vendor/:vendorId')
  @ApiOperation({ summary: 'Get attributes by Vendor ID' })
  @ApiResponse({
    status: 200,
    description: 'List of attributes created by the vendor',
    type: AttributesResponseWrapper,
  })
  async getAttributesByVendor(@Param('vendorId', ParseIntPipe) vendorId: number): Promise<AttributesResponseWrapper> {
    const attributes = await this.attributeService.getAttributesByVendor(vendorId);
    return {
      success: true,
      message: 'Attributes retrieved successfully',
      data: attributes,
      statusCode: 200,
    };
  }
}
