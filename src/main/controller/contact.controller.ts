import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ContactService } from '../service/contact.service';
import { CreateContactDTO } from '../dto/requests/contact/create-contact.dto';
import { UpdateContactDTO } from '../dto/requests/contact/update-contact.dto';
import { ContactResponseDto } from '../dto/responses/contact-response.dto';

@ApiTags('contacts')
@Controller('v1/contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Contact created', type: ContactResponseDto })
  async create(@Body() dto: CreateContactDTO) {
    const contact = await this.contactService.create(dto);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Contact created successfully',
      data: contact,
    };
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Contacts fetched', type: [ContactResponseDto] })
  async findAll() {
    const contacts = await this.contactService.findAll();
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Contacts fetched successfully',
      data: contacts,
    };
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Contact found', type: ContactResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const contact = await this.contactService.findOne(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Contact fetched successfully',
      data: contact,
    };
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Contact updated', type: ContactResponseDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContactDTO) {
    const contact = await this.contactService.update(id, dto);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Contact updated successfully',
      data: contact,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.contactService.remove(id);
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Contact deleted successfully',
    };
  }
}
