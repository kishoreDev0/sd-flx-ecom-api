import {
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationService } from '../service/notification.service';
import { AuthGuard } from '../commons/guards/auth.guard';
import { CommonUtilService } from '../utils/common.util';
import { LoggerService } from '../service/logger.service';
import {
  ProductRatingsResponseWrapper,
  ProductRatingStatsResponseWrapper,
} from '../dto/responses/product-rating-response.dto';

@ApiTags('Notifications')
@Controller('v1/notifications')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly commonUtilService: CommonUtilService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, type: ProductRatingsResponseWrapper })
  async getUserNotifications(
    @Request() req: any,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('unreadOnly') unreadOnly?: boolean,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const notifications = await this.notificationService.getUserNotifications(userId, {
        limit: limit || 20,
        offset: offset || 0,
        unread: unreadOnly === true,
      });

      return {
        success: true,
        message: 'Notifications retrieved successfully',
        data: notifications,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: 200, description: 'Unread count' })
  async getUnreadCount(@Request() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const count = await this.notificationService.getUnreadCount(userId);

      return {
        success: true,
        message: 'Unread count retrieved successfully',
        data: { unreadCount: count },
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  async markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      await this.notificationService.markAsRead(id);

      return {
        success: true,
        message: 'Notification marked as read successfully',
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Put('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@Request() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      await this.notificationService.markAllAsRead(userId);

      return {
        success: true,
        message: 'All notifications marked as read successfully',
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get notification statistics' })
  @ApiResponse({ status: 200, type: ProductRatingStatsResponseWrapper })
  async getNotificationStats(@Request() req: any) {
    try {
      const userId = this.commonUtilService.getUserIdFromRequest(req);
      const stats = await this.notificationService.getNotificationStats(userId);

      return {
        success: true,
        message: 'Notification statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      this.loggerService.error(error);
      throw error;
    }
  }
}
