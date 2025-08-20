import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { CreateOrderDTO } from '../dto/requests/order/create-order.dto';
import { UpdateOrderDTO, UpdateOrderStatusDTO } from '../dto/requests/order/update-order.dto';
import { UserRepository } from '../repository/user.repository';
import {
  OrderResponseWrapper,
  OrdersResponseWrapper,
} from '../dto/responses/order-response.dto';
import { ORDER_RESPONSES } from '../commons/constants/response-constants/order.constant';
import { LoggerService } from './logger.service';
import { OrderStatus } from '../entities/order.entity';
import { USER_RESPONSES } from '../commons/constants/response-constants/user.constant';
import { CartRepository } from '../repository/cart.repository';
import { MailService } from '../email/mail.service';
import {
  mailSubject,
  mailTemplates,
} from 'src/main/commons/constants/email/mail.constants';
import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly repo: OrderRepository,
    private readonly userRepo: UserRepository,
    private readonly cartRepo:CartRepository,
    private readonly prodRepo:ProductRepository,
    private readonly logger: LoggerService,
     private readonly mailService: MailService,
  ) {}

  async create(dto: CreateOrderDTO): Promise<OrderResponseWrapper> {
  try {
    const creator = await this.userRepo.findUserById(dto.createdBy);
    if (!creator) return USER_RESPONSES.USERS_NOT_FOUND()

    // If needed, get user from one of the products or creator
    const user = await this.userRepo.findUserById(dto.createdBy);
    if (!user) USER_RESPONSES.USERS_NOT_FOUND()

    // Extract product IDs
    const productIds = dto.productQuantity.map(pq => pq.product_id);

    // Calculate totalAmount using product prices
    let totalAmount = 0;
    for (const item of dto.productQuantity) {
      const product = dto.products.find(p => p.id === item.product_id);
      if (product) {
        totalAmount += product.price * item.quantity;
      }
    }

    const order = this.repo.create({
      user: { id: user.id } as any,
      productIds,
      status: OrderStatus.PENDING,
      shippingAddress: dto.address,
      totalAmount:totalAmount,
      notes: dto.notes,
      createdBy: { id: creator.id } as any,
    });

    const userCart = await this.cartRepo.findByUserId(order.user.id);
    userCart.productIds = [];
    await this.cartRepo.save(userCart)

    const savedOrder = await this.repo.save(order);

    // product 
      const allProducts = await this.prodRepo.getAll();
      const productQuantities = dto.productQuantity;

      const result = productQuantities
      .map(({ product_id, quantity }) => {
        const product = allProducts.find(p => p.id === Number(product_id));
        if (!product) return null; // skip if product not found
        return {
          name: product.name,
          price: product.price,
          quantity: quantity,
        };
      })
      .filter(Boolean);

     

      console.log(result);

    const context ={
      name:user.firstName +' ' + user.lastName,
      orderId:order.id,
      address:order.shippingAddress,
      product : result,
      trackUrl:'',
      creatDate:order.createdAt,
      subTotal:order.totalAmount
      
    }

    // mailer service
    await this.mailService.sendMail(user.officialEmail,
      mailSubject.mailFunction.orderConfirm,
      mailTemplates.mailFunction.orderConfirm, 
      context
    )

    return ORDER_RESPONSES.ORDER_CREATED(savedOrder);
  } catch (error) {
    this.logger.error(error);
    throw error;
  }
}


  async update(id: number, dto: UpdateOrderDTO): Promise<OrderResponseWrapper> {
    try {
      const order = await this.repo.findById(id);
      if (!order) return ORDER_RESPONSES.ORDER_NOT_FOUND();

      const updater = await this.userRepo.findUserById(dto.updatedBy);
      if (!updater) throw new NotFoundException('Updater user not found');

      if (dto.productIds) order.productIds = dto.productIds;
      if (dto.totalAmount !== undefined) order.totalAmount = dto.totalAmount;
      if (dto.status) order.status = dto.status;
      if (dto.shippingAddress) order.shippingAddress = dto.shippingAddress;
      if (dto.notes) order.notes = dto.notes;
      
      order.updatedBy = { id: updater.id } as any;

      const updatedOrder = await this.repo.save(order);

      return ORDER_RESPONSES.ORDER_UPDATED(updatedOrder);
    } catch (error) {
      throw error;
    }
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDTO): Promise<OrderResponseWrapper> {
    try {
      const order = await this.repo.findById(id);
      if (!order) return ORDER_RESPONSES.ORDER_NOT_FOUND();

      const updater = await this.userRepo.findUserById(dto.updatedBy);
      if (!updater) throw new NotFoundException('Updater user not found');

      order.status = dto.status;
      order.updatedBy = { id: updater.id } as any;

      const updatedOrder = await this.repo.save(order);

      return ORDER_RESPONSES.ORDER_STATUS_UPDATED(updatedOrder);
    } catch (error) {
      throw error;
    }
  }

  async getAllOrders(): Promise<OrdersResponseWrapper> {
    try {
      const orders = await this.repo.getAllOrders();
      if (!orders.length) return ORDER_RESPONSES.ORDERS_NOT_FOUND();

      return ORDER_RESPONSES.ORDERS_FETCHED(orders);
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(id: number): Promise<OrderResponseWrapper> {
    try {
      const order = await this.repo.findById(id);
      if (!order) return ORDER_RESPONSES.ORDER_NOT_FOUND();

      return ORDER_RESPONSES.ORDER_FETCHED(order);
    } catch (error) {
      throw error;
    }
  }

  async getOrdersByUserId(userId: number): Promise<OrdersResponseWrapper> {
    try {
      const orders = await this.repo.findByUserId(userId);
      if (!orders.length) return ORDER_RESPONSES.ORDERS_NOT_FOUND();

      return ORDER_RESPONSES.ORDERS_FETCHED_BY_USER_ID(orders);
    } catch (error) {
      throw error;
    }
  }

  async getOrdersByStatus(status: string): Promise<OrdersResponseWrapper> {
    try {
      const orders = await this.repo.findByStatus(status);
      if (!orders.length) return ORDER_RESPONSES.ORDERS_NOT_FOUND();

      return ORDER_RESPONSES.ORDERS_FETCHED_BY_STATUS(orders);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<OrderResponseWrapper> {
    try {
      const order = await this.repo.findById(id);
      if (!order) return ORDER_RESPONSES.ORDER_NOT_FOUND();

      await this.repo.deleteById(id);

      return ORDER_RESPONSES.ORDER_DELETED(id);
    } catch (error) {
      throw error;
    }
  }

  async subscribe(id:number,email:string){
      try{
         const existingUser = await this.userRepo.findUserById(id);
          if(!existingUser) return USER_RESPONSES.USER_NOT_FOUND();
          const context = {

          }
          await this.mailService.sendMail(
            email,
            mailSubject.mailFunction.subscribe,
            mailTemplates.mailFunction.subscribe,
            context
          )
          return ORDER_RESPONSES.SUBSCRIBE_SUCCESS();
  
      }catch(error){
        this.logger.log(error)
      }
  }

}