import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from '../repository/cart.repository';
import { CreateCartDTO } from '../dto/requests/cart/create-cart.dto';
import { UpdateCartDTO, UpdateCartListDTO } from '../dto/requests/cart/update-cart.dto';
import { UserRepository } from '../repository/user.repository';
import {
  CartResponseWrapper,
  CartsResponseWrapper,
  CartResponseDto,
} from '../dto/responses/cart-response.dto';
import { CART_RESPONSES } from '../commons/constants/response-constants/cart.constant'; 
import { LoggerService } from './logger.service';


@Injectable()
export class CartService {
  constructor(
    private readonly repo: CartRepository,
    private readonly userRepo: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateCartDTO): Promise<CartResponseWrapper> {
    try {
      const creator = await this.userRepo.findUserById(dto.createdBy);
      if (!creator) throw new NotFoundException('Creator user not found');

      const user = await this.userRepo.findUserById(dto.userId);
      if (!user) throw new NotFoundException('User not found');

      const existingUser = await this.repo.findById(user.id);
      if(existingUser){
        this.logger.log("User's cart has already present");
        return CART_RESPONSES.USER_HAS_ALREADY_PRESENT()
      }

      const cart = this.repo.create({
        user: { id: user.id } as any,
        productIds: dto.productIds,
        createdBy: { id: creator.id } as any,
      });

      const savedCart = await this.repo.save(cart);

      return CART_RESPONSES.CART_CREATED(savedCart);
    } catch (error) {
        this.logger.log(error)
    }
  }

  async update(id: number, dto: UpdateCartDTO): Promise<CartResponseWrapper> {
    try {
      const cart = await this.repo.findById(id);
      if (!cart) return CART_RESPONSES.CART_NOT_FOUND();

      const updater = await this.userRepo.findUserById(dto.updatedBy);
      if (!updater) throw new NotFoundException('Updater user not found');

      if (dto.productIds) cart.productIds = dto.productIds;
      cart.updatedBy = { id: updater.id } as any;

      const updatedCart = await this.repo.save(cart);

      return CART_RESPONSES.CART_UPDATED(updatedCart);
    } catch (error) {
      throw error;
    }
  }

  async updatelist(id: number, dto: UpdateCartListDTO): Promise<CartResponseWrapper> {
        try {
          const cart = await this.repo.findByUserId(id);
          if (!cart) return CART_RESPONSES.CART_NOT_FOUND();

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
          return CART_RESPONSES.CART_UPDATED(updatedWishlist);
        } catch (error) {
          throw error;
        }
    }

  async getAllCarts(): Promise<CartsResponseWrapper> {
    try {
      const carts = await this.repo.getAllCarts();
      if (!carts.length) return CART_RESPONSES.CARTS_NOT_FOUND();

      return CART_RESPONSES.CARTS_FETCHED(carts);
    } catch (error) {
      throw error;
    }
  }

  async getCartByUserId(userId: number): Promise<CartResponseWrapper | null> {
    const cart = await this.repo.findByUserId(userId);
    if (!cart) return CART_RESPONSES.CART_NOT_FOUND();
    return CART_RESPONSES.CARTS_FETCHED_BY_USER_ID(cart)
  }

  async delete(id: number): Promise<CartResponseWrapper> {
    try {
      const cart = await this.repo.findById(id);
      if (!cart) return CART_RESPONSES.CART_NOT_FOUND();

      await this.repo.deleteById(id);

      return CART_RESPONSES.CART_DELETED(id);
    } catch (error) {
      throw error;
    }
  }

}
