import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  ShippingAddress, 
  ShippingMethod, 
  ShippingZone, 
  Shipment, 
  ShippingTracking,
  ShippingStatus, 
  ShippingMethodType, 
  CarrierType 
} from '../entities/shipping.entity';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { CreateShippingAddressDto, UpdateShippingAddressDto } from '../dto/requests/shipping/create-shipping-address.dto';
import { CreateShippingMethodDto } from '../dto/requests/shipping/create-shipping-address.dto';
import { CreateShippingZoneDto } from '../dto/requests/shipping/create-shipping-address.dto';
import { CreateShipmentDto, UpdateShipmentStatusDto } from '../dto/requests/shipping/create-shipping-address.dto';
import { CalculateShippingDto } from '../dto/requests/shipping/create-shipping-address.dto';
import { 
  ShippingAddressResponseDto, 
  ShippingMethodResponseDto, 
  ShippingZoneResponseDto, 
  ShipmentResponseDto, 
  ShippingTrackingResponseDto,
  ShippingCalculationResponseDto,
  ShippingStatsDto 
} from '../dto/responses/shipping-response.dto';
import { NotificationService } from './notification.service';
import { NotificationType } from '../entities/notification.entity';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(ShippingAddress)
    private readonly shippingAddressRepository: Repository<ShippingAddress>,
    @InjectRepository(ShippingMethod)
    private readonly shippingMethodRepository: Repository<ShippingMethod>,
    @InjectRepository(ShippingZone)
    private readonly shippingZoneRepository: Repository<ShippingZone>,
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,
    @InjectRepository(ShippingTracking)
    private readonly shippingTrackingRepository: Repository<ShippingTracking>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  private generateShipmentNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SHP-${timestamp}-${random}`;
  }

  // Shipping Address Methods
  private toShippingAddressResponseDto(address: ShippingAddress): ShippingAddressResponseDto {
    return {
      id: address.id,
      userId: address.userId,
      addressType: address.addressType,
      firstName: address.firstName,
      lastName: address.lastName,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      email: address.email,
      isDefault: address.isDefault,
      instructions: address.instructions,
      isActive: address.isActive,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }

  async createShippingAddress(createAddressDto: CreateShippingAddressDto): Promise<ShippingAddressResponseDto> {
    const user = await this.userRepository.findOneBy({ id: createAddressDto.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If this is set as default, unset other default addresses
    if (createAddressDto.isDefault) {
      await this.shippingAddressRepository.update(
        { userId: createAddressDto.userId, isDefault: true },
        { isDefault: false }
      );
    }

    const address = this.shippingAddressRepository.create(createAddressDto);
    const savedAddress = await this.shippingAddressRepository.save(address);

    return this.toShippingAddressResponseDto(savedAddress);
  }

  async findAllShippingAddresses(userId: number): Promise<ShippingAddressResponseDto[]> {
    const addresses = await this.shippingAddressRepository.find({
      where: { userId, isActive: true },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });

    return addresses.map(address => this.toShippingAddressResponseDto(address));
  }

  async findOneShippingAddress(id: number, userId: number): Promise<ShippingAddressResponseDto> {
    const address = await this.shippingAddressRepository.findOne({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }

    return this.toShippingAddressResponseDto(address);
  }

  async updateShippingAddress(id: number, updateAddressDto: UpdateShippingAddressDto, userId: number): Promise<ShippingAddressResponseDto> {
    const address = await this.shippingAddressRepository.findOne({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }

    // If this is set as default, unset other default addresses
    if (updateAddressDto.isDefault) {
      await this.shippingAddressRepository.update(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    Object.assign(address, updateAddressDto);
    const savedAddress = await this.shippingAddressRepository.save(address);

    return this.toShippingAddressResponseDto(savedAddress);
  }

  async removeShippingAddress(id: number, userId: number): Promise<void> {
    const address = await this.shippingAddressRepository.findOne({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Shipping address not found');
    }

    await this.shippingAddressRepository.remove(address);
  }

  // Shipping Method Methods
  private toShippingMethodResponseDto(method: ShippingMethod): ShippingMethodResponseDto {
    return {
      id: method.id,
      name: method.name,
      methodType: method.methodType,
      basePrice: method.basePrice,
      additionalPrice: method.additionalPrice,
      minDeliveryDays: method.minDeliveryDays,
      maxDeliveryDays: method.maxDeliveryDays,
      description: method.description,
      isActive: method.isActive,
      restrictions: method.restrictions,
      createdAt: method.createdAt,
      updatedAt: method.updatedAt,
    };
  }

  async createShippingMethod(createMethodDto: CreateShippingMethodDto): Promise<ShippingMethodResponseDto> {
    const method = this.shippingMethodRepository.create(createMethodDto);
    const savedMethod = await this.shippingMethodRepository.save(method);

    return this.toShippingMethodResponseDto(savedMethod);
  }

  async findAllShippingMethods(): Promise<ShippingMethodResponseDto[]> {
    const methods = await this.shippingMethodRepository.find({
      where: { isActive: true },
      order: { basePrice: 'ASC' },
    });

    return methods.map(method => this.toShippingMethodResponseDto(method));
  }

  // Shipping Zone Methods
  private toShippingZoneResponseDto(zone: ShippingZone): ShippingZoneResponseDto {
    return {
      id: zone.id,
      name: zone.name,
      countries: zone.countries,
      states: zone.states,
      postalCodes: zone.postalCodes,
      baseShippingCost: zone.baseShippingCost,
      additionalItemCost: zone.additionalItemCost,
      isActive: zone.isActive,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt,
    };
  }

  async createShippingZone(createZoneDto: CreateShippingZoneDto): Promise<ShippingZoneResponseDto> {
    const zone = this.shippingZoneRepository.create(createZoneDto);
    const savedZone = await this.shippingZoneRepository.save(zone);

    return this.toShippingZoneResponseDto(savedZone);
  }

  async findAllShippingZones(): Promise<ShippingZoneResponseDto[]> {
    const zones = await this.shippingZoneRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });

    return zones.map(zone => this.toShippingZoneResponseDto(zone));
  }

  // Shipment Methods
  private toShipmentResponseDto(shipment: Shipment): ShipmentResponseDto {
    return {
      id: shipment.id,
      shipmentNumber: shipment.shipmentNumber,
      orderId: shipment.orderId,
      status: shipment.status,
      carrier: shipment.carrier,
      trackingNumber: shipment.trackingNumber,
      trackingUrl: shipment.trackingUrl,
      shippingMethod: shipment.shippingMethod,
      shippingCost: shipment.shippingCost,
      originAddress: shipment.originAddress,
      destinationAddress: shipment.destinationAddress,
      weight: shipment.weight,
      weightUnit: shipment.weightUnit,
      dimensions: shipment.dimensions,
      packageType: shipment.packageType,
      shippedAt: shipment.shippedAt,
      estimatedDeliveryDate: shipment.estimatedDeliveryDate,
      deliveredAt: shipment.deliveredAt,
      deliveryNotes: shipment.deliveryNotes,
      failureReason: shipment.failureReason,
      trackingHistory: shipment.trackingHistory,
      metadata: shipment.metadata,
      createdById: shipment.createdById,
      updatedById: shipment.updatedById,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
      order: shipment.order ? {
        id: shipment.order.id,
        orderNumber: shipment.order.orderNumber,
        totalAmount: shipment.order.totalAmount,
      } : undefined,
    };
  }

  async createShipment(createShipmentDto: CreateShipmentDto): Promise<ShipmentResponseDto> {
    const order = await this.orderRepository.findOneBy({ id: createShipmentDto.orderId });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const shipment = this.shipmentRepository.create({
      ...createShipmentDto,
      shipmentNumber: this.generateShipmentNumber(),
    });

    const savedShipment = await this.shipmentRepository.save(shipment);

    // Send notification to customer
    await this.notificationService.create({
      userId: order.userId,
      title: 'Shipment Created',
      message: `Shipment ${savedShipment.shipmentNumber} has been created for your order #${order.orderNumber}`,
      type: NotificationType.ORDER_SHIPPED,
      createdBy: createShipmentDto.createdById,
    });

    return this.toShipmentResponseDto(savedShipment);
  }

  async findAllShipments(options: {
    orderId?: number;
    status?: ShippingStatus;
    carrier?: CarrierType;
    limit?: number;
    offset?: number;
  } = {}): Promise<ShipmentResponseDto[]> {
    const query = this.shipmentRepository.createQueryBuilder('shipment')
      .leftJoinAndSelect('shipment.order', 'order');

    if (options.orderId) {
      query.andWhere('shipment.orderId = :orderId', { orderId: options.orderId });
    }

    if (options.status) {
      query.andWhere('shipment.status = :status', { status: options.status });
    }

    if (options.carrier) {
      query.andWhere('shipment.carrier = :carrier', { carrier: options.carrier });
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.offset) {
      query.offset(options.offset);
    }

    query.orderBy('shipment.createdAt', 'DESC');

    const shipments = await query.getMany();
    return shipments.map(shipment => this.toShipmentResponseDto(shipment));
  }

  async findOneShipment(id: number): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return this.toShipmentResponseDto(shipment);
  }

  async findByShipmentNumber(shipmentNumber: string): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({
      where: { shipmentNumber },
      relations: ['order'],
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    return this.toShipmentResponseDto(shipment);
  }

  async updateShipmentStatus(id: number, updateStatusDto: UpdateShipmentStatusDto): Promise<ShipmentResponseDto> {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    const oldStatus = shipment.status;
    shipment.status = updateStatusDto.status as ShippingStatus;

    // Update timestamps based on status
    switch (updateStatusDto.status) {
      case ShippingStatus.SHIPPED:
        shipment.shippedAt = new Date();
        break;
      case ShippingStatus.DELIVERED:
        shipment.deliveredAt = new Date();
        break;
    }

    if (updateStatusDto.trackingNumber) {
      shipment.trackingNumber = updateStatusDto.trackingNumber;
    }

    if (updateStatusDto.trackingUrl) {
      shipment.trackingUrl = updateStatusDto.trackingUrl;
    }

    if (updateStatusDto.deliveryNotes) {
      shipment.deliveryNotes = updateStatusDto.deliveryNotes;
    }

    if (updateStatusDto.failureReason) {
      shipment.failureReason = updateStatusDto.failureReason;
    }

    shipment.updatedById = updateStatusDto.updatedById;

    const savedShipment = await this.shipmentRepository.save(shipment);

    // Send notification for status change
    if (oldStatus !== shipment.status && shipment.order) {
      await this.notificationService.create({
        userId: shipment.order.userId,
        title: `Shipment Status Updated - ${shipment.status.toUpperCase()}`,
        message: `Your shipment ${shipment.shipmentNumber} status has been updated to ${shipment.status}`,
        type: NotificationType.ORDER_SHIPPED,
        createdBy: updateStatusDto.updatedById,
      });
    }

    return this.toShipmentResponseDto(savedShipment);
  }

  // Shipping Calculation
  async calculateShipping(calculateShippingDto: CalculateShippingDto): Promise<ShippingCalculationResponseDto> {
    const methods = await this.shippingMethodRepository.find({
      where: { isActive: true },
      order: { basePrice: 'ASC' },
    });

    const zones = await this.shippingZoneRepository.find({
      where: { isActive: true },
    });

    // Find applicable zone
    const applicableZone = zones.find(zone => 
      zone.countries.includes(calculateShippingDto.destinationCountry) &&
      (!zone.states || zone.states.includes(calculateShippingDto.destinationState || '')) &&
      (!zone.postalCodes || zone.postalCodes.includes(calculateShippingDto.destinationPostalCode || ''))
    );

    const availableMethods = methods.map(method => {
      const baseCost = applicableZone ? applicableZone.baseShippingCost : method.basePrice;
      const additionalCost = (calculateShippingDto.itemCount - 1) * (applicableZone ? applicableZone.additionalItemCost : method.additionalPrice);
      const totalCost = baseCost + additionalCost;

      return {
        method: method.methodType,
        cost: totalCost,
        estimatedDays: Math.floor((method.minDeliveryDays + method.maxDeliveryDays) / 2),
        description: method.description || `${method.name} shipping`,
      };
    });

    const recommendedMethod = availableMethods[0]?.method || ShippingMethodType.STANDARD;
    const totalShippingCost = availableMethods[0]?.cost || 0;

    return {
      destinationCountry: calculateShippingDto.destinationCountry,
      destinationState: calculateShippingDto.destinationState,
      destinationPostalCode: calculateShippingDto.destinationPostalCode,
      totalWeight: calculateShippingDto.totalWeight,
      itemCount: calculateShippingDto.itemCount,
      availableMethods,
      recommendedMethod,
      totalShippingCost,
    };
  }

  // Shipping Statistics
  async getShippingStats(): Promise<ShippingStatsDto> {
    const shipments = await this.shipmentRepository.find();

    const stats = {
      totalShipments: shipments.length,
      pendingShipments: shipments.filter(s => s.status === ShippingStatus.PENDING).length,
      shippedShipments: shipments.filter(s => s.status === ShippingStatus.SHIPPED).length,
      deliveredShipments: shipments.filter(s => s.status === ShippingStatus.DELIVERED).length,
      failedShipments: shipments.filter(s => s.status === ShippingStatus.FAILED).length,
      totalShippingCost: shipments.reduce((sum, s) => sum + s.shippingCost, 0),
      shipmentsByCarrier: this.groupShipmentsByCarrier(shipments),
      shipmentsByMethod: this.groupShipmentsByMethod(shipments),
    };

    return stats;
  }

  private groupShipmentsByCarrier(shipments: Shipment[]): any[] {
    const grouped = shipments.reduce((acc, shipment) => {
      const carrier = shipment.carrier;
      if (!acc[carrier]) {
        acc[carrier] = { carrier, count: 0, cost: 0 };
      }
      acc[carrier].count++;
      acc[carrier].cost += shipment.shippingCost;
      return acc;
    }, {});

    return Object.values(grouped);
  }

  private groupShipmentsByMethod(shipments: Shipment[]): any[] {
    const grouped = shipments.reduce((acc, shipment) => {
      const method = shipment.shippingMethod;
      if (!acc[method]) {
        acc[method] = { method, count: 0, cost: 0 };
      }
      acc[method].count++;
      acc[method].cost += shipment.shippingCost;
      return acc;
    }, {});

    return Object.values(grouped);
  }

  async removeShipment(id: number): Promise<void> {
    const shipment = await this.shipmentRepository.findOneBy({ id });
    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    await this.shipmentRepository.remove(shipment);
  }
}
