import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WishlistService } from '../service/wishlist.service';
import { CreateWishlistDTO } from '../dto/requests/wishlist/create-wishlist.dto';
import { UpdateWishlistDTO, UpdateWishlistItemDTO } from '../dto/requests/wishlist/update-wishlist.dto';
import {
  WishlistResponseWrapper,
  WishlistsResponseWrapper,
} from '../dto/responses/wishlist-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';

@ApiTags('Wishlists')
@Controller('v1/wishlists')
@UseGuards(AuthGuard)
@ApiHeadersForAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

   @Post()
    create(@Body() dto: CreateWishlistDTO): Promise<WishlistResponseWrapper> {
     try{
       const result =  this.wishlistService.create(dto);
       return result
     }
     catch(error){
      console.log(error)
     }
    }
  
    @Patch(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateWishlistDTO,
    ): Promise<WishlistResponseWrapper> {
      try {
        return await this.wishlistService.update(id, dto);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    @Patch('/list/:id')
    async updateList(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateWishlistItemDTO,
    ): Promise<WishlistResponseWrapper> {
      try {
        return await this.wishlistService.updatelist(id, dto);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }


    @Patch('/move/:id')
    async moveListToCart(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateWishlistItemDTO,
    ): Promise<WishlistResponseWrapper> {
      try {
        return await this.wishlistService.movelistToCart(id, dto);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

  
    @Get()
    async findAll(): Promise<WishlistsResponseWrapper> {
      const result =  this.wishlistService.getAllWishlists();
      return result
    }
  
    @Get(':id')
    async getByUserId(
      @Param('id', ParseIntPipe) id: number ): Promise<WishlistResponseWrapper> {
      try {
          const cart = await this.wishlistService.getWishlistByUserId(id);
          return cart 
        } catch (error) {
          console.error(error);
      }
    }
  
    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<WishlistResponseWrapper> {
      return this.wishlistService.delete(id);
    }
}
