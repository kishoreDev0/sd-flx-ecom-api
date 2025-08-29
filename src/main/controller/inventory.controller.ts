import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { InventoryService } from '../service/inventory.service';
import { CreateInventoryDto } from '../dto/requests/inventory/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/requests/inventory/update-inventory.dto';
import { AdjustStockDto } from '../dto/requests/inventory/adjust-stock.dto';
import { BulkImportInventoryDto } from '../dto/requests/inventory/bulk-import.dto';
import { InventoryResponseDto } from '../dto/responses/inventory-response.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { RolesGuard } from '../commons/guards/roles.guard';
import { RequireRoles } from '../commons/guards/roles.decorator';
import { Roles } from '../commons/enumerations/role.enum';
import { ApiHeadersForAuth } from '../commons/guards/auth-headers.decorator';
import { CommonUtilService } from '../utils/common.util';
import { LoggerService } from '../service/logger.service';

@ApiTags('inventory')
@Controller('v1/inventory')
@UseGuards(AuthGuard, RolesGuard)
@ApiHeadersForAuth()
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly commonUtilService: CommonUtilService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  @RequireRoles(Roles.ADMIN, Roles.VENDOR)
  @ApiResponse({ status: 201, description: 'Inventory created', type: InventoryResponseDto })
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    try {
      const inventory = await this.inventoryService.create(createInventoryDto);
      return {
        success: true,
        message: 'Inventory created successfully',
        data: inventory,
      };
    } catch (error) {
      this.loggerService.error('Error creating inventory', error);
      throw error;
    }
  }

  @Get()
  @ApiQuery({ name: 'vendorId', required: false, type: Number, description: 'Filter by vendor ID' })
  @ApiQuery({ name: 'type', required: false, enum: ['all', 'low-stock', 'out-of-stock'], description: 'Filter by stock status' })
  @ApiResponse({ status: 200, description: 'Inventory items fetched', type: [InventoryResponseDto] })
  async findAll(
    @Query('vendorId') vendorId?: number,
    @Query('type') type?: string,
  ) {
    try {
      let inventories: InventoryResponseDto[];

      switch (type) {
        case 'low-stock':
          inventories = await this.inventoryService.findLowStock(vendorId);
          break;
        case 'out-of-stock':
          inventories = await this.inventoryService.findOutOfStock(vendorId);
          break;
        default:
          inventories = await this.inventoryService.findAll(vendorId);
      }

      return {
        success: true,
        message: 'Inventory items fetched successfully',
        data: inventories,
      };
    } catch (error) {
      this.loggerService.error('Error fetching inventory items', error);
      throw error;
    }
  }

  @Get('stats')
  @ApiQuery({ name: 'vendorId', required: false, type: Number, description: 'Filter stats by vendor ID' })
  @ApiResponse({ status: 200, description: 'Inventory statistics fetched' })
  async getStats(@Query('vendorId') vendorId?: number) {
    try {
      const stats = await this.inventoryService.getInventoryStats(vendorId);
      return {
        success: true,
        message: 'Inventory statistics fetched successfully',
        data: stats,
      };
    } catch (error) {
      this.loggerService.error('Error fetching inventory stats', error);
      throw error;
    }
  }

  @Get('low-stock')
  @ApiQuery({ name: 'vendorId', required: false, type: Number, description: 'Filter by vendor ID' })
  @ApiResponse({ status: 200, description: 'Low stock items fetched', type: [InventoryResponseDto] })
  async findLowStock(@Query('vendorId') vendorId?: number) {
    try {
      const inventories = await this.inventoryService.findLowStock(vendorId);
      return {
        success: true,
        message: 'Low stock items fetched successfully',
        data: inventories,
      };
    } catch (error) {
      this.loggerService.error('Error fetching low stock items', error);
      throw error;
    }
  }

  @Get('out-of-stock')
  @ApiQuery({ name: 'vendorId', required: false, type: Number, description: 'Filter by vendor ID' })
  @ApiResponse({ status: 200, description: 'Out of stock items fetched', type: [InventoryResponseDto] })
  async findOutOfStock(@Query('vendorId') vendorId?: number) {
    try {
      const inventories = await this.inventoryService.findOutOfStock(vendorId);
      return {
        success: true,
        message: 'Out of stock items fetched successfully',
        data: inventories,
      };
    } catch (error) {
      this.loggerService.error('Error fetching out of stock items', error);
      throw error;
    }
  }

  @Get('product/:productId')
  @ApiResponse({ status: 200, description: 'Inventory by product fetched', type: [InventoryResponseDto] })
  async findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    try {
      const inventories = await this.inventoryService.findByProduct(productId);
      return {
        success: true,
        message: 'Inventory by product fetched successfully',
        data: inventories,
      };
    } catch (error) {
      this.loggerService.error('Error fetching inventory by product', error);
      throw error;
    }
  }

  @Get('vendor/:vendorId')
  @ApiResponse({ status: 200, description: 'Inventory by vendor fetched', type: [InventoryResponseDto] })
  async findByVendor(@Param('vendorId', ParseIntPipe) vendorId: number) {
    try {
      const inventories = await this.inventoryService.findByVendor(vendorId);
      return {
        success: true,
        message: 'Inventory by vendor fetched successfully',
        data: inventories,
      };
    } catch (error) {
      this.loggerService.error('Error fetching inventory by vendor', error);
      throw error;
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Inventory item found', type: InventoryResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const inventory = await this.inventoryService.findOne(id);
      return {
        success: true,
        message: 'Inventory item found successfully',
        data: inventory,
      };
    } catch (error) {
      this.loggerService.error('Error fetching inventory item', error);
      throw error;
    }
  }

  @Patch(':id')
  @RequireRoles(Roles.ADMIN, Roles.VENDOR)
  @ApiResponse({ status: 200, description: 'Inventory updated', type: InventoryResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    try {
      const inventory = await this.inventoryService.update(id, updateInventoryDto);
      return {
        success: true,
        message: 'Inventory updated successfully',
        data: inventory,
      };
    } catch (error) {
      this.loggerService.error('Error updating inventory', error);
      throw error;
    }
  }

  @Post(':id/adjust-stock')
  @RequireRoles(Roles.ADMIN, Roles.VENDOR)
  @ApiResponse({ status: 200, description: 'Stock adjusted', type: InventoryResponseDto })
  async adjustStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() adjustStockDto: AdjustStockDto,
  ) {
    try {
      const inventory = await this.inventoryService.adjustStock(id, adjustStockDto);
      return {
        success: true,
        message: 'Stock adjusted successfully',
        data: inventory,
      };
    } catch (error) {
      this.loggerService.error('Error adjusting stock', error);
      throw error;
    }
  }

  @Post('bulk-import')
  @RequireRoles(Roles.ADMIN, Roles.VENDOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        vendorId: {
          type: 'string',
        },
        notes: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Bulk import completed', type: [InventoryResponseDto] })
  async bulkImport(
    @UploadedFile() file: Express.Multer.File,
    @Body() bulkImportDto: BulkImportInventoryDto,
  ) {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      // Parse CSV/Excel file and convert to items
      const items = await this.parseInventoryFile(file);
      
      const results = await this.inventoryService.bulkImport(
        Number(bulkImportDto.vendorId),
        items,
        Number(bulkImportDto.createdById),
      );

      return {
        success: true,
        message: `Bulk import completed. ${results.length} items processed.`,
        data: results,
      };
    } catch (error) {
      this.loggerService.error('Error in bulk import', error);
      throw error;
    }
  }

  @Delete(':id')
  @RequireRoles(Roles.ADMIN)
  @ApiResponse({ status: 200, description: 'Inventory deleted' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.inventoryService.remove(id);
      return {
        success: true,
        message: 'Inventory deleted successfully',
      };
    } catch (error) {
      this.loggerService.error('Error deleting inventory', error);
      throw error;
    }
  }

  private async parseInventoryFile(file: Express.Multer.File): Promise<any[]> {
    // This is a simplified implementation
    // In a real application, you would use a library like 'csv-parser' or 'xlsx'
    // to properly parse CSV/Excel files
    
    const fileContent = file.buffer.toString();
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const items = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const item: Record<string, string> = {};
        
        headers.forEach((header, index) => {
          item[header] = values[index];
        });
        
        items.push({
          productId: Number(item.productId),
          currentStock: Number(item.currentStock),
          reservedStock: Number(item.reservedStock) || 0,
          lowStockThreshold: Number(item.lowStockThreshold) || 0,
          stockNotes: item.stockNotes || '',
        });
      }
    }

    return items;
  }
}
