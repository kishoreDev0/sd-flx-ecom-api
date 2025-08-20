// src/controller/faq.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { FaqService } from '../service/faq.service';
import { CreateFaqDTO } from '../dto/requests/faq/create-faq.dto';
import { UpdateFaqDTO } from '../dto/requests/faq/update-faq.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { FaqsResponseWrapper } from '../dto/responses/faq.response.dto';


@Controller('v1/faqs')
@ApiTags('Faqs')
// @UseGuards(AuthGuard)
// @ApiHeadersForAuth()
export class FaqController {
  constructor(private readonly service: FaqService) {}
  
  @Post()
  @UseGuards(AuthGuard)
  @ApiHeadersForAuth()
  create(@Body() createFaqDto: CreateFaqDTO) {
  return this.service.create(createFaqDto);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateFaqDTO) {
    try{
          const response = await this.service.update(id, dto);
          return response;

    }catch(error){
       console.log(error  )
    }
  }
  @Get()
  async findAll(): Promise<FaqsResponseWrapper> {
      return this.service.getAllFaqs();
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }

  

}
