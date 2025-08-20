import { Injectable, NotFoundException } from '@nestjs/common';
import { WishlistRepository } from '../repository/wishlist.repository';
import { UserRepository } from '../repository/user.repository';
import { ProductRepository } from '../repository/product.repository';
import { CartRepository } from '../repository/cart.repository';
import { CreateWishlistDTO } from '../dto/requests/wishlist/create-wishlist.dto';
import { UpdateWishlistDTO, UpdateWishlistItemDTO } from '../dto/requests/wishlist/update-wishlist.dto';
import {
  WishlistResponseWrapper,
  WishlistsResponseWrapper,
} from '../dto/responses/wishlist-response.dto';
import { LoggerService } from './logger.service';
import { WISHLIST_RESPONSES } from '../commons/constants/response-constants/wishlist.constant';
import { CART_RESPONSES } from '../commons/constants/response-constants/cart.constant';
import { USER_RESPONSES } from '../commons/constants/response-constants/user.constant';


@Injectable()
export class WishlistService {
   constructor(
    private readonly repo: WishlistRepository,
    private readonly userRepo: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly cartRepository : CartRepository,
    private readonly logger: LoggerService,
  ) {}
  
    async create(dto: CreateWishlistDTO): Promise<WishlistResponseWrapper> {
      try {
        const creator = await this.userRepo.findUserById(dto.createdBy);
        if (!creator) throw new NotFoundException('Creator user not found');
  
        const user = await this.userRepo.findUserById(dto.userId);
        if (!user) throw new NotFoundException('User not found');
  
        const existingUser = await this.getWishlistByUserId(user.id);
        if(existingUser){
          this.logger.log("User has already present");
          return WISHLIST_RESPONSES.USER_HAS_ALREADY_PRESENT()
        }
  
        const cart = this.repo.create({
          user: { id: user.id } as any,
          productIds: dto.productIds,
          createdBy: { id: creator.id } as any,
        });
  
        const savedWishlist = await this.repo.save(cart);
  
        return WISHLIST_RESPONSES.WISHLIST_CREATED(savedWishlist);
      } catch (error) {
          this.logger.log(error)
      }
    }
  
    async update(id: number, dto: UpdateWishlistDTO): Promise<WishlistResponseWrapper> {
      try {
        const cart = await this.repo.findById(id);
        if (!cart) return WISHLIST_RESPONSES.WISHLIST_NOT_FOUND();
  
        const updater = await this.userRepo.findUserById(dto.updatedBy);
        if (!updater) throw new NotFoundException('Updater user not found');
  
        if (dto.productIds) cart.productIds = dto.productIds;
        cart.updatedBy = { id: updater.id } as any;
  
        const updatedWishlist = await this.repo.save(cart);
  
        return WISHLIST_RESPONSES.WISHLIST_UPDATED(updatedWishlist);
      } catch (error) {
        throw error;
      }
    }
    async updatelist(id: number, dto: UpdateWishlistItemDTO): Promise<WishlistResponseWrapper> {
        try {
          const cart = await this.repo.findByUserId(id);
          console.log(cart)
          if (!cart) return WISHLIST_RESPONSES.WISHLIST_NOT_FOUND();

          const updater = await this.userRepo.findUserById(dto.updatedBy);
          if (!updater) throw new NotFoundException('Updater user not found');

          const prdId = String(dto.productId)
          const index = cart.productIds.findIndex(id => String(id) === String(dto.productId));

          if (index > -1) {
            cart.productIds.splice(index, 1);
          } else {
            cart.productIds.push(dto.productId);
          }
          cart.updatedBy = { id: updater.id } as any;
          const updatedWishlist = await this.repo.save(cart);
          return WISHLIST_RESPONSES.WISHLIST_UPDATED(updatedWishlist);
        } catch (error) {
          throw error;
        }
    }

    async movelistToCart(id: number, dto: UpdateWishlistItemDTO): Promise<WishlistResponseWrapper> {
        try {
          const wishlist = await this.repo.findByUserId(id);
          if (!wishlist) return WISHLIST_RESPONSES.WISHLIST_NOT_FOUND();

          const cart = await this.cartRepository.findByUserId(id)
          if (!cart) return CART_RESPONSES.CART_NOT_FOUND();

          const updater = await this.userRepo.findUserById(dto.updatedBy);
          if (!updater) return USER_RESPONSES.USERS_NOT_FOUND();

          const prdId = String(dto.productId)
          const index = cart.productIds.findIndex(id => String(id) === String(dto.productId));

          if (index > -1) {
              return WISHLIST_RESPONSES.WISHLISTS_CART_ALREADY_PRESENT()
          } else {
            cart.productIds.push(dto.productId);
          }

          
          cart.updatedBy = { id: updater.id } as any;
          wishlist.updatedBy = { id: updater.id } as any;
          const updatedWishlist = await this.repo.save(wishlist);
           await this.cartRepository.save(cart);
          return WISHLIST_RESPONSES.WISHLIST_MOVED(updatedWishlist);
        } catch (error) {
          throw error;
        }
    } 

  
    async getAllWishlists(): Promise<WishlistsResponseWrapper> {
      try {
        const carts = await this.repo.getAllWishlists();
        if (!carts.length) return WISHLIST_RESPONSES.WISHLISTS_NOT_FOUND();
  
        return WISHLIST_RESPONSES.WISHLISTS_FETCHED(carts);
      } catch (error) {
        throw error;
      }
    }
  
    async getWishlistByUserId(userId: number): Promise<WishlistResponseWrapper | null> {
      const cart = await this.repo.findByUserId(Number(userId));

      if (!cart) return WISHLIST_RESPONSES.WISHLIST_NOT_FOUND();
      return WISHLIST_RESPONSES.WISHLISTS_FETCHED_BY_USER_ID(cart)
    }
  
    async delete(id: number): Promise<WishlistResponseWrapper> {
      try {
        const cart = await this.repo.findById(id);
        if (!cart) return WISHLIST_RESPONSES.WISHLIST_NOT_FOUND();
  
        await this.repo.deleteById(id);
  
        return WISHLIST_RESPONSES.WISHLIST_DELETED(id);
      } catch (error) {
        throw error;
      }
    }
}
