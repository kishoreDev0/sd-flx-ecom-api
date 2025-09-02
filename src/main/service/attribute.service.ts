import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from '../entities/attribute.entity';
import { AttributeValue } from '../entities/attribute-value.entity';
import { CreateAttributeDto } from '../dto/requests/attribute/create-attribute.dto';
import { CreateAttributeValueDto } from '../dto/requests/attribute/create-attribute-value.dto';
import { CreateAttributeWithValuesDto } from '../dto/requests/attribute/create-attribute-with-values.dto';
import { AttributeResponseDto } from '../dto/responses/attribute/attribute-response.dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
  ) {}

  async createAttribute(createAttributeDto: CreateAttributeDto): Promise<AttributeResponseDto> {
    const { name, createdBy } = createAttributeDto;

    // Check if attribute with same name already exists
    const existingAttribute = await this.attributeRepository.findOne({
      where: { name },
    });

    if (existingAttribute) {
      throw new BadRequestException(`Attribute with name '${name}' already exists`);
    }

    const attribute = this.attributeRepository.create({
      ...createAttributeDto,
      createdBy: { id: createdBy },
      updatedBy: { id: createdBy },
    });

    const savedAttribute = await this.attributeRepository.save(attribute);
    return this.mapToResponseDto(savedAttribute);
  }

  async createAttributeWithValues(createAttributeWithValuesDto: CreateAttributeWithValuesDto, userId: number): Promise<AttributeResponseDto> {
    const { name, values, ...attributeData } = createAttributeWithValuesDto;

    // Check if attribute with same name already exists
    const existingAttribute = await this.attributeRepository.findOne({
      where: { name },
    });

    if (existingAttribute) {
      throw new BadRequestException(`Attribute with name '${name}' already exists`);
    }

    // Create the attribute first
    const attribute = this.attributeRepository.create({
      ...attributeData,
      name,
      type: attributeData.type as 'text' | 'number' | 'boolean' | 'select' | 'multiselect',
      createdBy: { id: userId },
      updatedBy: { id: userId },
    });

    const savedAttribute = await this.attributeRepository.save(attribute);

    // Create all attribute values
    const attributeValues = values.map((valueDto, index) => {
      return this.attributeValueRepository.create({
        attributeId: savedAttribute.id,
        value: valueDto.value,
        displayName: valueDto.displayName || valueDto.value,
        sortOrder: index + 1,
        isActive: true,
        createdBy: { id: userId },
        updatedBy: { id: userId },
      });
    });

    // Save all attribute values
    const savedValues = await this.attributeValueRepository.save(attributeValues);

    // Return the complete attribute with values
    const completeAttribute = await this.attributeRepository.findOne({
      where: { id: savedAttribute.id },
      relations: ['values', 'values.createdBy', 'values.updatedBy', 'createdBy', 'updatedBy'],
    });

    return this.mapToResponseDto(completeAttribute);
  }

  async createAttributeValue(createAttributeValueDto: CreateAttributeValueDto): Promise<AttributeValue> {
    const { attributeId, value, createdBy } = createAttributeValueDto;

    // Verify attribute exists
    const attribute = await this.attributeRepository.findOne({
      where: { id: attributeId },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${attributeId} not found`);
    }

    // Check if value already exists for this attribute
    const existingValue = await this.attributeValueRepository.findOne({
      where: { attributeId, value },
    });

    if (existingValue) {
      throw new BadRequestException(`Value '${value}' already exists for attribute '${attribute.name}'`);
    }

    const attributeValue = this.attributeValueRepository.create({
      ...createAttributeValueDto,
      createdBy: { id: createdBy },
      updatedBy: { id: createdBy },
    });

    return await this.attributeValueRepository.save(attributeValue);
  }

  async getAllAttributes(): Promise<AttributeResponseDto[]> {
    const attributes = await this.attributeRepository.find({
      relations: ['values', 'values.createdBy', 'values.updatedBy', 'createdBy', 'updatedBy'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    return attributes.map(attr => this.mapToResponseDto(attr));
  }

  async getAttributeById(id: number): Promise<AttributeResponseDto> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['values', 'values.createdBy', 'values.updatedBy', 'createdBy', 'updatedBy'],
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    return this.mapToResponseDto(attribute);
  }

  async getAttributeValuesByAttributeId(attributeId: number): Promise<AttributeValue[]> {
    const attribute = await this.attributeRepository.findOne({
      where: { id: attributeId },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${attributeId} not found`);
    }

    return await this.attributeValueRepository.find({
      where: { attributeId, isActive: true },
      order: { sortOrder: 'ASC', value: 'ASC' },
    });
  }

  async updateAttribute(id: number, updateData: Partial<CreateAttributeDto>, updatedBy: number): Promise<AttributeResponseDto> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['values', 'values.createdBy', 'values.updatedBy', 'createdBy', 'updatedBy'],
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    // Check if name is being changed and if it conflicts with existing
    if (updateData.name && updateData.name !== attribute.name) {
      const existingAttribute = await this.attributeRepository.findOne({
        where: { name: updateData.name },
      });

      if (existingAttribute) {
        throw new BadRequestException(`Attribute with name '${updateData.name}' already exists`);
      }
    }

    Object.assign(attribute, updateData, { updatedBy: { id: updatedBy } });
    const savedAttribute = await this.attributeRepository.save(attribute);
    
    // Fetch the updated attribute with all relations
    const updatedAttribute = await this.attributeRepository.findOne({
      where: { id: savedAttribute.id },
      relations: ['values', 'values.createdBy', 'values.updatedBy', 'createdBy', 'updatedBy'],
    });
    
    return this.mapToResponseDto(updatedAttribute);
  }

  async deleteAttribute(id: number): Promise<void> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
    });

    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }

    // TODO: Add check for product usage when ProductAttribute is implemented
    // For now, allow deletion

    await this.attributeRepository.remove(attribute);
  }

  async getAttributesByCategory(categoryId: number): Promise<AttributeResponseDto[]> {
    // This would need to be implemented based on your category-attribute relationship
    // For now, returning all attributes
    return this.getAllAttributes();
  }

  async getAttributesByVendor(vendorId: number): Promise<AttributeResponseDto[]> {
    // Find vendor to resolve its user id
    const vendor = await (this as any).attributeValueRepository.manager.getRepository('Vendor').findOne({
      where: { id: vendorId },
      relations: ['user'],
    });

    if (!vendor || !vendor.user) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    const attributes = await this.attributeRepository.find({
      where: { createdBy: { id: vendor.user.id } as any },
      relations: ['values', 'values.createdBy', 'values.updatedBy', 'createdBy', 'updatedBy'],
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    return attributes.map(attr => this.mapToResponseDto(attr));
  }

  private mapToResponseDto(attribute: Attribute): AttributeResponseDto {
    return {
      id: attribute.id,
      name: attribute.name,
      description: attribute.description,
      type: attribute.type,
      isRequired: attribute.isRequired,
      isActive: attribute.isActive,
      sortOrder: attribute.sortOrder,
      values: attribute.values?.map(value => ({
        id: value.id,
        value: value.value,
        displayName: value.displayName,
        description: value.description,
        sortOrder: value.sortOrder,
        isActive: value.isActive,
        createdBy: value.createdBy ? {
          id: value.createdBy.id,
          firstName: value.createdBy.firstName,
          lastName: value.createdBy.lastName,
          email: value.createdBy.officialEmail,
        } : undefined,
        updatedBy: value.updatedBy ? {
          id: value.updatedBy.id,
          firstName: value.updatedBy.firstName,
          lastName: value.updatedBy.lastName,
          email: value.updatedBy.officialEmail,
        } : undefined,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
      })) || [],
      createdBy: attribute.createdBy ? {
        id: attribute.createdBy.id,
        firstName: attribute.createdBy.firstName,
        lastName: attribute.createdBy.lastName,
        email: attribute.createdBy.officialEmail,
      } : undefined,
      updatedBy: attribute.updatedBy ? {
        id: attribute.updatedBy.id,
        firstName: attribute.updatedBy.firstName,
        lastName: attribute.updatedBy.lastName,
        email: attribute.updatedBy.officialEmail,
      } : undefined,
      createdAt: attribute.createdAt,
      updatedAt: attribute.updatedAt,
    };
  }
}
