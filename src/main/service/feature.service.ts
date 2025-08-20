import { Injectable, NotFoundException } from '@nestjs/common';
import { FeatureRepository } from '../repository/feature.repository';
import { CreateFeatureDTO } from '../dto/requests/feature/create-feature.dto';
import { UpdateFeatureDTO } from '../dto/requests/feature/update-feature.dto';
import { ProductRepository } from '../repository/product.repository';
import { UserRepository } from '../repository/user.repository';
import {
  FeatureResponseWrapper,
  FeaturesResponseWrapper,
} from '../dto/responses/feature.response.dto';
import { FEATURE_RESPONSES } from '../commons/constants/response-constants/feature.response';

@Injectable()
export class FeatureService {
  constructor(
    private readonly repo: FeatureRepository,
    private readonly productRepo: ProductRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async create(dto: CreateFeatureDTO): Promise<FeatureResponseWrapper> {
    const creator = await this.userRepo.findUserById(dto.createdBy);

    const feature = this.repo.create({
      name: dto.name,
      createdBy: creator,
      updatedBy: creator,
    });

    const savedFeature = await this.repo.save(feature);
   
    return FEATURE_RESPONSES.FEATURE_CREATED(savedFeature);
  }

  async update(id: number, dto: UpdateFeatureDTO): Promise<FeatureResponseWrapper> {

    const feature = await this.repo.findById(id);
    if (!feature) throw new NotFoundException(FEATURE_RESPONSES.FEATURE_NOT_FOUND());

    const updater = await this.userRepo.findUserById(dto.updatedBy);
        

    Object.assign(feature, dto, { updatedBy: updater });
    const updatedFeature = await this.repo.save(feature);

    return FEATURE_RESPONSES.FEATURE_UPDATED(updatedFeature);
  }

  async getAllFeatures(): Promise<FeaturesResponseWrapper> {
    const features = await this.repo.getAllFeatures();
    if (!features.length) return FEATURE_RESPONSES.FEATURES_NOT_FOUND();    

    return FEATURE_RESPONSES.FEATURES_FETCHED(features);
  }

  async delete(id: number): Promise<FeatureResponseWrapper> {
    const feature = await this.repo.findById(id);
    if (!feature) throw new NotFoundException(FEATURE_RESPONSES.FEATURE_NOT_FOUND());

    await this.repo.deleteById(id);
    return FEATURE_RESPONSES.FEATURE_DELETED(id);
  }

}
