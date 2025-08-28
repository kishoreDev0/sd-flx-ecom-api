import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRating } from '../entities/product-rating.entity';

@Injectable()
export class ProductRatingRepository {
  constructor(
    @InjectRepository(ProductRating)
    private readonly repo: Repository<ProductRating>,
  ) {}

  async findById(id: number): Promise<ProductRating> {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
  }

  async findByProductId(productId: number, options?: {
    approvedOnly?: boolean;
    activeOnly?: boolean;
    limit?: number;
    offset?: number;
    sortBy?: 'rating' | 'createdAt' | 'isHelpful';
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<ProductRating[]> {
    const queryBuilder = this.repo.createQueryBuilder('rating')
      .leftJoinAndSelect('rating.user', 'user')
      .leftJoinAndSelect('rating.product', 'product')
      .where('rating.productId = :productId', { productId });

    if (options?.approvedOnly) {
      queryBuilder.andWhere('rating.isApproved = :isApproved', { isApproved: true });
    }

    if (options?.activeOnly) {
      queryBuilder.andWhere('rating.isActive = :isActive', { isActive: true });
    }

    // Apply sorting
    const sortBy = options?.sortBy || 'createdAt';
    const sortOrder = options?.sortOrder || 'DESC';
    
    switch (sortBy) {
      case 'rating':
        queryBuilder.orderBy('rating.rating', sortOrder);
        break;
      case 'isHelpful':
        queryBuilder.orderBy('rating.isHelpful', sortOrder);
        break;
      case 'createdAt':
      default:
        queryBuilder.orderBy('rating.createdAt', sortOrder);
        break;
    }

    // Apply pagination
    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }
    if (options?.offset) {
      queryBuilder.offset(options.offset);
    }

    return queryBuilder.getMany();
  }

  async findByUserId(userId: number): Promise<ProductRating[]> {
    return this.repo.find({
      where: { userId },
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndProduct(userId: number, productId: number): Promise<ProductRating> {
    return this.repo.findOne({
      where: { userId, productId },
      relations: ['user', 'product'],
    });
  }

  async findPendingApproval(): Promise<ProductRating[]> {
    return this.repo.find({
      where: { isApproved: false, isActive: true },
      relations: ['user', 'product'],
      order: { createdAt: 'ASC' },
    });
  }

  async findApprovedByProduct(productId: number): Promise<ProductRating[]> {
    return this.repo.find({
      where: { productId, isApproved: true, isActive: true },
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async createRating(ratingData: Partial<ProductRating>): Promise<ProductRating> {
    const rating = this.repo.create(ratingData);
    return this.repo.save(rating);
  }

  async updateRating(id: number, ratingData: Partial<ProductRating>): Promise<ProductRating> {
    await this.repo.update(id, ratingData);
    return this.findById(id);
  }

  async deleteRating(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async softDeleteRating(id: number): Promise<void> {
    await this.repo.update(id, { isActive: false });
  }

  async restoreRating(id: number): Promise<void> {
    await this.repo.update(id, { isActive: true });
  }

  async approveRating(id: number, isApproved: boolean): Promise<void> {
    await this.repo.update(id, { isApproved });
  }

  async incrementHelpfulCount(id: number): Promise<void> {
    await this.repo.increment({ id }, 'isHelpful', 1);
  }

  async decrementHelpfulCount(id: number): Promise<void> {
    await this.repo.decrement({ id }, 'isHelpful', 1);
  }

  async getProductRatingStats(productId: number): Promise<{
    averageRating: number;
    totalRatings: number;
    verifiedPurchases: number;
    ratingDistribution: Record<string, number>;
    approvedReviews: number;
    pendingReviews: number;
  }> {
    // Get average rating and total count
    const avgResult = await this.repo.createQueryBuilder('rating')
      .select('AVG(rating.rating)', 'averageRating')
      .addSelect('COUNT(*)', 'totalRatings')
      .where('rating.productId = :productId', { productId })
      .andWhere('rating.isActive = :isActive', { isActive: true })
      .getRawOne();

    // Get verified purchases count
    const verifiedResult = await this.repo.createQueryBuilder('rating')
      .select('COUNT(*)', 'verifiedPurchases')
      .where('rating.productId = :productId', { productId })
      .andWhere('rating.isVerifiedPurchase = :isVerified', { isVerified: true })
      .andWhere('rating.isActive = :isActive', { isActive: true })
      .getRawOne();

    // Get rating distribution
    const distributionResult = await this.repo.createQueryBuilder('rating')
      .select('rating.rating', 'rating')
      .addSelect('COUNT(*)', 'count')
      .where('rating.productId = :productId', { productId })
      .andWhere('rating.isActive = :isActive', { isActive: true })
      .groupBy('rating.rating')
      .getRawMany();

    // Get approved and pending counts
    const approvedResult = await this.repo.createQueryBuilder('rating')
      .select('COUNT(*)', 'approvedReviews')
      .where('rating.productId = :productId', { productId })
      .andWhere('rating.isApproved = :isApproved', { isApproved: true })
      .andWhere('rating.isActive = :isActive', { isActive: true })
      .getRawOne();

    const pendingResult = await this.repo.createQueryBuilder('rating')
      .select('COUNT(*)', 'pendingReviews')
      .where('rating.productId = :productId', { productId })
      .andWhere('rating.isApproved = :isApproved', { isApproved: false })
      .andWhere('rating.isActive = :isActive', { isActive: true })
      .getRawOne();

    // Build rating distribution object
    const ratingDistribution: Record<string, number> = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i.toString()] = 0;
    }
    
    distributionResult.forEach(item => {
      const rating = Math.floor(parseFloat(item.rating));
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating.toString()] = parseInt(item.count);
      }
    });

    return {
      averageRating: parseFloat(avgResult.averageRating) || 0,
      totalRatings: parseInt(avgResult.totalRatings) || 0,
      verifiedPurchases: parseInt(verifiedResult.verifiedPurchases) || 0,
      ratingDistribution,
      approvedReviews: parseInt(approvedResult.approvedReviews) || 0,
      pendingReviews: parseInt(pendingResult.pendingReviews) || 0,
    };
  }

  async getOverallRatingStats(): Promise<{
    totalRatings: number;
    averageRating: number;
    totalProducts: number;
    totalUsers: number;
  }> {
    const stats = await this.repo.createQueryBuilder('rating')
      .select('COUNT(*)', 'totalRatings')
      .addSelect('AVG(rating.rating)', 'averageRating')
      .addSelect('COUNT(DISTINCT rating.productId)', 'totalProducts')
      .addSelect('COUNT(DISTINCT rating.userId)', 'totalUsers')
      .where('rating.isActive = :isActive', { isActive: true })
      .getRawOne();

    return {
      totalRatings: parseInt(stats.totalRatings) || 0,
      averageRating: parseFloat(stats.averageRating) || 0,
      totalProducts: parseInt(stats.totalProducts) || 0,
      totalUsers: parseInt(stats.totalUsers) || 0,
    };
  }
}
