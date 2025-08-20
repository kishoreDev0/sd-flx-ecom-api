import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoggerService } from 'src/main/service/logger.service';
import { authConstants } from 'src/main/commons/constants/authentication/authentication.constants';
import {
  mailSubject,
  mailTemplates,
} from 'src/main/commons/constants/email/mail.constants';
import { ROLE_RESPONSES } from 'src/main/commons/constants/response-constants/role.constant';
import { USER_RESPONSES } from 'src/main/commons/constants/response-constants/user.constant';
import { MailService } from 'src/main/email/mail.service';
import { RoleRepository } from 'src/main/repository/role.repository';
import { UserRepository } from 'src/main/repository/user.repository';
import {
  InviteUserResponseDto,
  InviteUserResponseWrapper,
} from 'src/main/dto/responses/invite-response.dto';
import { User } from 'src/main/entities/user.entity';
import { InviteUserRequestDto } from 'src/main/dto/requests/auth/invite-user.dto';
import { RoleService } from '../role.service';
import { AUTH_RESPONSES } from 'src/main/commons/constants/response-constants/auth.constant';
import { WishlistRepository } from 'src/main/repository/wishlist.repository';
import { CartRepository } from 'src/main/repository/cart.repository';

@Injectable()
export class InviteService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly mailService: MailService,
    private readonly logger: LoggerService,
    private readonly roleService: RoleService,
    private readonly wishlistRepository: WishlistRepository,
    private readonly cartRepository: CartRepository,
  ) {}

  async inviteUser(
    inviteUserDto: InviteUserRequestDto,
  ): Promise<InviteUserResponseWrapper | object> {
    try {
      const { officialEmail, roleId, createdBy, primaryPhone } = inviteUserDto;

      const validationError = await this.validateInviteUserRequest(
        createdBy.id,
        roleId.id,
        officialEmail,
        primaryPhone,
      );

      if (validationError) {
        return validationError;
      }

      this.logger.log(`Inviting user with email: ${officialEmail}`);

      const createdByUser = await this.userRepository.findUserById(
        createdBy.id,
      );

      const role = await this.roleRepository.findByRoleId(roleId.id);

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const user = this.userRepository.create({
        firstName: inviteUserDto.firstName,
        officialEmail,
        primaryPhone,
        password: hashedPassword,
        isActive: true,
        createdBy: createdByUser.id,
        role: role,
      });

      const savedUser = await this.userRepository.save(user);

      const loginLink = `${authConstants.domain}/${authConstants.endpoints.login}`;
      const subject = mailSubject.auth.registration;
      const template = mailTemplates.auth.registration;
      const context = {
        username: officialEmail,
        password: tempPassword,
        link: loginLink,
      };

      await this.mailService.sendMail(
        officialEmail,
        subject,
        template,
        context,
      );

      this.logger.log(`Invite sent successfully to ${officialEmail}`);

      const inviteUserResponse: InviteUserResponseDto = {
        userDetails: {
          id: savedUser.id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          officialEmail: savedUser.officialEmail,
          primaryPhone: savedUser.primaryPhone,
          trlId: savedUser.trlId,
          imageURL: savedUser.imageURL,
          isActive: savedUser.isActive,
          lastLoginTime: savedUser.lastLoginTime,
          createdBy: { id: savedUser.createdBy } as User,
          createdAt: savedUser.createdAt,
          updatedBy: { id: savedUser.updatedBy } as User,
          updatedAt: savedUser.updatedAt,
          role: {
            id: savedUser.role.id,
            roleName: savedUser.role.roleName,
          },
        },
      } as InviteUserResponseDto;

      return AUTH_RESPONSES.INVITE_SUCCESS(inviteUserResponse);
    } catch (error) {
      this.logger.error(`Failed to invite user: ${error.message}`);
      throw error;
    }
  }

  async inviteUseRev(
    inviteUserDto: InviteUserRequestDto,
  ): Promise<InviteUserResponseWrapper | object> {
    try {
      const { officialEmail, roleId, createdBy, primaryPhone } = inviteUserDto;
      this.logger.log(`Inviting user with role: ${roleId}`);

      const existingUserEmail =
        await this.userRepository.findByEmail(officialEmail);

        if(existingUserEmail){
          return AUTH_RESPONSES.EMAIL_EXISTS;
        }

        const existingUserContact =
        await this.userRepository.findByContactNumber(primaryPhone);
        if(existingUserContact){
          return AUTH_RESPONSES.CONTACT_EXISTS;
        }

      this.logger.log(`Inviting user with email: ${officialEmail}`);

      const createdByUser = await this.userRepository.findUserById(
        createdBy.id,
      );

      const role = await this.roleRepository.findByRoleId(roleId.id ?? 2) ;

      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const user = this.userRepository.create({
        firstName: inviteUserDto.firstName,
        officialEmail,
        primaryPhone,
        password: hashedPassword,
        isActive: true,
        createdBy: createdByUser.id,
        role: role,
      });

      const savedUser = await this.userRepository.save(user);

      const loginLink = `${authConstants.domain}/${authConstants.endpoints.login}`;
      const subject = mailSubject.auth.registration;
      const template = mailTemplates.auth.registration;
      const context = {
        username: officialEmail,
        password: tempPassword,
        link: loginLink,
      };

      // Create wishlist and cart for the new user

      const craetedwish  = await this.wishlistRepository.findByUserId(savedUser.id);
      const craetedcart  = await this.cartRepository.findByUserId(savedUser.id);
      if(craetedwish === null  || craetedcart === null){

    
     
      if(!craetedwish){
        const wishlistSet = this.wishlistRepository.create({
        user: { id: user.id } as any,
        productIds: [],
        createdBy: { id: createdByUser.id } as any,
      });
        const result = await this.wishlistRepository.save(wishlistSet);
        console.log(result)

        
      }
      if(!craetedcart){
        const cartSet = this.cartRepository.create({
        user: { id: user.id } as any,
        productIds: [],
        createdBy: { id: createdByUser.id } as any,
      });
        const result = await this.cartRepository.save(cartSet);
        console.log(result)
      }
      }
     
      await this.mailService.sendMail(
        officialEmail,
        subject,
        template,
        context,
      );

      this.logger.log(`Invite sent successfully to ${officialEmail}`);

      const inviteUserResponse: InviteUserResponseDto = {
        userDetails: {
          id: savedUser.id,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          officialEmail: savedUser.officialEmail,
          primaryPhone: savedUser.primaryPhone,
          trlId: savedUser.trlId,
          imageURL: savedUser.imageURL,
          isActive: savedUser.isActive,
          lastLoginTime: savedUser.lastLoginTime,
          createdBy: { id: savedUser.createdBy } as User,
          createdAt: savedUser.createdAt,
          updatedBy: { id: savedUser.updatedBy } as User,
          updatedAt: savedUser.updatedAt,
          role: {
            id: savedUser.role.id,
            roleName: savedUser.role.roleName,
          },
        },
      } as InviteUserResponseDto;

      return AUTH_RESPONSES.INVITE_SUCCESS(inviteUserResponse);
    } catch (error) {
      this.logger.error(`Failed to invite user: ${error.message}`);
      throw error;
    }
  }

  async validateInviteUserRequest(
    createdBy: number,
    roleId: number,
    officialEmail?: string,
    primaryPhone?: string,
  ): Promise<InviteUserResponseWrapper | null> {
    if (!this.roleService.isSuperUserOrUserRole(roleId)) {
      this.logger.error(
        `Only User roles can be invited. Attempted to invite role with ID: ${roleId}`,
      );
      return ROLE_RESPONSES.ROLE_NOT_ALLOWED;
    }

    if (officialEmail) {
      const existingUserEmail =
        await this.userRepository.findByEmail(officialEmail);
      if (existingUserEmail) {
        this.logger.error(`Email already exists: ${officialEmail}`);
        return AUTH_RESPONSES.EMAIL_EXISTS;
      }
    }

    if (!officialEmail) {
      this.logger.error('Official email is required');
      return AUTH_RESPONSES.INVALID_REQUEST;
    }

    if (primaryPhone) {
      const existingUserContact =
        await this.userRepository.findByContactNumber(primaryPhone);
      if (existingUserContact) {
        this.logger.error(`Contact already exists: ${primaryPhone}`);
        return AUTH_RESPONSES.CONTACT_EXISTS;
      }
    }

    if (!primaryPhone) {
      this.logger.error('Conatact is required');
      return AUTH_RESPONSES.CONTACT_REQUIRED;
    }

    const createdByUser = await this.userRepository.findUserById(createdBy);
    if (!createdByUser) {
      this.logger.error(`CreatedBy user not found with ID: ${createdBy}`);
      return USER_RESPONSES.USER_NOT_FOUND();
    }

    const role = await this.roleRepository.findByRoleId(roleId);
    if (!role) {
      this.logger.error(`Role not found with ID: ${roleId}`);
      return ROLE_RESPONSES.ROLE_NOT_FOUND(roleId);
    }

    return null;
  }
}
