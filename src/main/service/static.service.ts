// service/static.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Static } from '../entities/static.entity';
import { CreateStaticDTO } from '../dto/requests/static/create-static.dto';
import { UpdateStaticDTO } from '../dto/requests/static/update-static.dto';
import { StaticResponseDto } from '../dto/responses/static-response.dto';

@Injectable()
export class StaticService {
  constructor(
    @InjectRepository(Static)
    private readonly staticRepository: Repository<Static>
  ) {}

  private toResponseDto(entity: Static): StaticResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      isActive: entity.isActive,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async create(dto: CreateStaticDTO): Promise<StaticResponseDto> {
    const entity = this.staticRepository.create(dto);
    const saved = await this.staticRepository.save(entity);
    return this.toResponseDto(saved);
  }

  async findAll(): Promise<StaticResponseDto[]> {
    const all = await this.staticRepository.find();
    return all.map(this.toResponseDto);
  }

  async findOne(id: number): Promise<StaticResponseDto> {
    const entity = await this.staticRepository.findOneBy({ id });
    if (!entity) throw new NotFoundException('Static page not found');
    return this.toResponseDto(entity);
  }

  async update(id: number, dto: UpdateStaticDTO): Promise<StaticResponseDto> {
    const entity = await this.staticRepository.findOneBy({ id });
    if (!entity) throw new NotFoundException('Static page not found');
    Object.assign(entity, dto);
    const updated = await this.staticRepository.save(entity);
    return this.toResponseDto(updated);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.staticRepository.findOneBy({ id });
    if (!entity) throw new NotFoundException('Static page not found');
    await this.staticRepository.remove(entity);
  }
}
