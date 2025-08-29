import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { Product } from '../entities/product.entity';
import { Vendor } from '../entities/vendor.entity';
import { CreateInventoryDto } from '../dto/requests/inventory/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/requests/inventory/update-inventory.dto';
import { AdjustStockDto, StockAdjustmentType } from '../dto/requests/inventory/adjust-stock.dto';
import { BulkImportInventoryItemDto } from '../dto/requests/inventory/bulk-import.dto';
import { InventoryResponseDto } from '../dto/responses/inventory-response.dto';
import { NotificationService } from './notification.service';
import { NotificationType } from '../entities/notification.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly notificationService: NotificationService,
  ) {}

  private toInventoryResponseDto(inventory: Inventory): InventoryResponseDto {
    return {
      id: inventory.id,
      productId: inventory.productId,
      vendorId: inventory.vendorId,
      currentStock: inventory.currentStock,
      reservedStock: inventory.reservedStock,
      availableStock: inventory.availableStock,
      lowStockThreshold: inventory.lowStockThreshold,
      isLowStock: inventory.isLowStock,
      isOutOfStock: inventory.isOutOfStock,
      lastStockUpdate: inventory.lastStockUpdate,
      lastLowStockAlert: inventory.lastLowStockAlert,
      stockNotes: inventory.stockNotes,
      stockHistory: inventory.stockHistory,
      createdById: inventory.createdById,
      updatedById: inventory.updatedById,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
      product: inventory.product ? {
        id: inventory.product.id,
        name: inventory.product.name,
        price: inventory.product.price,
      } : undefined,
      vendor: inventory.vendor ? {
        id: inventory.vendor.id,
        vendorName: inventory.vendor.vendorName,
      } : undefined,
    };
  }

  private calculateAvailableStock(currentStock: number, reservedStock: number): number {
    return Math.max(0, currentStock - reservedStock);
  }

  private updateStockStatus(inventory: Inventory): void {
    inventory.availableStock = this.calculateAvailableStock(inventory.currentStock, inventory.reservedStock);
    inventory.isOutOfStock = inventory.availableStock <= 0;
    inventory.isLowStock = inventory.availableStock <= inventory.lowStockThreshold && inventory.availableStock > 0;
  }

  private async addStockHistory(
    inventory: Inventory,
    quantity: number,
    type: StockAdjustmentType,
    reason: string,
    reference?: string,
  ): Promise<void> {
    if (!inventory.stockHistory) {
      inventory.stockHistory = [];
    }

    inventory.stockHistory.push({
      date: new Date(),
      quantity,
      type,
      reason,
      reference,
    });

    // Keep only last 100 entries
    if (inventory.stockHistory.length > 100) {
      inventory.stockHistory = inventory.stockHistory.slice(-100);
    }
  }

  async create(createInventoryDto: CreateInventoryDto): Promise<InventoryResponseDto> {
    // Check if inventory already exists for this product and vendor
    const existingInventory = await this.inventoryRepository.findOne({
      where: {
        productId: createInventoryDto.productId,
        vendorId: createInventoryDto.vendorId,
      },
    });

    if (existingInventory) {
      throw new BadRequestException('Inventory already exists for this product and vendor');
    }

    // Verify product and vendor exist
    const product = await this.productRepository.findOneBy({ id: createInventoryDto.productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const vendor = await this.vendorRepository.findOneBy({ id: createInventoryDto.vendorId });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const inventory = this.inventoryRepository.create({
      ...createInventoryDto,
      availableStock: this.calculateAvailableStock(createInventoryDto.currentStock, createInventoryDto.reservedStock || 0),
      isOutOfStock: this.calculateAvailableStock(createInventoryDto.currentStock, createInventoryDto.reservedStock || 0) <= 0,
      isLowStock: this.calculateAvailableStock(createInventoryDto.currentStock, createInventoryDto.reservedStock || 0) <= (createInventoryDto.lowStockThreshold || 0),
      lastStockUpdate: new Date(),
    });

    await this.inventoryRepository.save(inventory);
    return this.toInventoryResponseDto(inventory);
  }

  async findAll(vendorId?: number): Promise<InventoryResponseDto[]> {
    const query = this.inventoryRepository.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.vendor', 'vendor');

    if (vendorId) {
      query.where('inventory.vendorId = :vendorId', { vendorId });
    }

    const inventories = await query.getMany();
    return inventories.map(inv => this.toInventoryResponseDto(inv));
  }

  async findOne(id: number): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product', 'vendor'],
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return this.toInventoryResponseDto(inventory);
  }

  async findByProduct(productId: number): Promise<InventoryResponseDto[]> {
    const inventories = await this.inventoryRepository.find({
      where: { productId },
      relations: ['product', 'vendor'],
    });

    return inventories.map(inv => this.toInventoryResponseDto(inv));
  }

  async findByVendor(vendorId: number): Promise<InventoryResponseDto[]> {
    const inventories = await this.inventoryRepository.find({
      where: { vendorId },
      relations: ['product', 'vendor'],
    });

    return inventories.map(inv => this.toInventoryResponseDto(inv));
  }

  async findLowStock(vendorId?: number): Promise<InventoryResponseDto[]> {
    const query = this.inventoryRepository.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.vendor', 'vendor')
      .where('inventory.isLowStock = :isLowStock', { isLowStock: true });

    if (vendorId) {
      query.andWhere('inventory.vendorId = :vendorId', { vendorId });
    }

    const inventories = await query.getMany();
    return inventories.map(inv => this.toInventoryResponseDto(inv));
  }

  async findOutOfStock(vendorId?: number): Promise<InventoryResponseDto[]> {
    const query = this.inventoryRepository.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product')
      .leftJoinAndSelect('inventory.vendor', 'vendor')
      .where('inventory.isOutOfStock = :isOutOfStock', { isOutOfStock: true });

    if (vendorId) {
      query.andWhere('inventory.vendorId = :vendorId', { vendorId });
    }

    const inventories = await query.getMany();
    return inventories.map(inv => this.toInventoryResponseDto(inv));
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product', 'vendor'],
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const oldStock = inventory.currentStock;
    const oldLowStockStatus = inventory.isLowStock;

    Object.assign(inventory, updateInventoryDto);
    inventory.lastStockUpdate = new Date();

    this.updateStockStatus(inventory);

    // Add to stock history if stock changed
    if (updateInventoryDto.currentStock !== undefined && updateInventoryDto.currentStock !== oldStock) {
      const difference = updateInventoryDto.currentStock - oldStock;
      const type = difference > 0 ? StockAdjustmentType.IN : StockAdjustmentType.OUT;
      await this.addStockHistory(
        inventory,
        Math.abs(difference),
        type,
        'Manual stock update',
      );
    }

    await this.inventoryRepository.save(inventory);

    // Send low stock alert if status changed
    if (!oldLowStockStatus && inventory.isLowStock) {
      await this.sendLowStockAlert(inventory);
    }

    return this.toInventoryResponseDto(inventory);
  }

  async adjustStock(id: number, adjustStockDto: AdjustStockDto): Promise<InventoryResponseDto> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
      relations: ['product', 'vendor'],
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const oldStock = inventory.currentStock;
    const oldLowStockStatus = inventory.isLowStock;

    // Adjust stock based on type
    switch (adjustStockDto.type) {
      case StockAdjustmentType.IN:
        inventory.currentStock += adjustStockDto.quantity;
        break;
      case StockAdjustmentType.OUT:
        if (inventory.currentStock < adjustStockDto.quantity) {
          throw new BadRequestException('Insufficient stock for adjustment');
        }
        inventory.currentStock -= adjustStockDto.quantity;
        break;
      case StockAdjustmentType.ADJUSTMENT:
        inventory.currentStock = adjustStockDto.quantity;
        break;
    }

    inventory.lastStockUpdate = new Date();
    this.updateStockStatus(inventory);

    // Add to stock history
    await this.addStockHistory(
      inventory,
      adjustStockDto.quantity,
      adjustStockDto.type,
      adjustStockDto.reason,
      adjustStockDto.reference,
    );

    await this.inventoryRepository.save(inventory);

    // Send low stock alert if status changed
    if (!oldLowStockStatus && inventory.isLowStock) {
      await this.sendLowStockAlert(inventory);
    }

    return this.toInventoryResponseDto(inventory);
  }

  async bulkImport(vendorId: number, items: BulkImportInventoryItemDto[], createdById: number): Promise<InventoryResponseDto[]> {
    const results: InventoryResponseDto[] = [];

    for (const item of items) {
      try {
        // Check if inventory exists
        let inventory = await this.inventoryRepository.findOne({
          where: {
            productId: item.productId,
            vendorId,
          },
        });

        if (inventory) {
          // Update existing inventory
          inventory.currentStock = item.currentStock;
          inventory.reservedStock = item.reservedStock || 0;
          inventory.lowStockThreshold = item.lowStockThreshold || 0;
          inventory.stockNotes = item.stockNotes;
          inventory.lastStockUpdate = new Date();
          this.updateStockStatus(inventory);
        } else {
          // Create new inventory
          inventory = this.inventoryRepository.create({
            productId: item.productId,
            vendorId,
            currentStock: item.currentStock,
            reservedStock: item.reservedStock || 0,
            lowStockThreshold: item.lowStockThreshold || 0,
            stockNotes: item.stockNotes,
            createdById,
            lastStockUpdate: new Date(),
          });
          this.updateStockStatus(inventory);
        }

        await this.inventoryRepository.save(inventory);
        results.push(this.toInventoryResponseDto(inventory));
      } catch (error) {
        console.error(`Error importing inventory for product ${item.productId}:`, error);
      }
    }

    return results;
  }

  async remove(id: number): Promise<void> {
    const inventory = await this.inventoryRepository.findOneBy({ id });
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    await this.inventoryRepository.remove(inventory);
  }

  private async sendLowStockAlert(inventory: Inventory): Promise<void> {
    try {
      // Send notification to vendor
      await this.notificationService.create({
        userId: inventory.vendorId,
        title: 'Low Stock Alert',
        message: `Product ${inventory.product?.name || inventory.productId} is running low on stock. Current available stock: ${inventory.availableStock}`,
        type: NotificationType.LOW_STOCK,
        isRead: false,
        createdBy: inventory.createdById,
      });

      inventory.lastLowStockAlert = new Date();
      await this.inventoryRepository.save(inventory);
    } catch (error) {
      console.error('Error sending low stock alert:', error);
    }
  }

  async getInventoryStats(vendorId?: number): Promise<{
    totalProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    totalStockValue: number;
  }> {
    const query = this.inventoryRepository.createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.product', 'product');

    if (vendorId) {
      query.where('inventory.vendorId = :vendorId', { vendorId });
    }

    const inventories = await query.getMany();

    const stats = {
      totalProducts: inventories.length,
      lowStockProducts: inventories.filter(inv => inv.isLowStock).length,
      outOfStockProducts: inventories.filter(inv => inv.isOutOfStock).length,
      totalStockValue: inventories.reduce((sum, inv) => {
        return sum + (inv.currentStock * (inv.product?.price || 0));
      }, 0),
    };

    return stats;
  }
}
