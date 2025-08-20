import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact-us.entity';
import { CreateContactDTO } from '../dto/requests/contact/create-contact.dto';
import { UpdateContactDTO } from '../dto/requests/contact/update-contact.dto';
import { ContactResponseDto, ContactResponseWrapper, ContactsResponseWrapper } from '../dto/responses/contact-response.dto';
import { UserRepository } from '../repository/user.repository';
import { LoggerService } from './logger.service';
import { USER_RESPONSES } from '../commons/constants/response-constants/user.constant';
import { CONTACT_RESPONSES } from '../commons/constants/response-constants/contact.constant';
import { MailService } from '../email/mail.service';
import { mailSubject, mailTemplates } from '../commons/constants/email/mail.constants';
import { OrderService } from './order.service';
import { ORDER_RESPONSES } from '../commons/constants/response-constants/order.constant';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
    private readonly mailerService: MailService,
    private readonly orderService:OrderService
  ) {}

  

  async create(dto: CreateContactDTO): Promise<ContactResponseWrapper> {
    try{
        const existingUser = await this.userRepository.findUserById(dto.createdBy);
        if(!existingUser){
            this.logger.error(`User with ID ${dto.createdBy} does not exist`);
            return USER_RESPONSES.USERS_NOT_FOUND();
        }
        const existingOrderResponse = await this.orderService.getOrderById(Number(dto.orderId));
        if(!existingOrderResponse || !existingOrderResponse.data){
            this.logger.error(`Order with ID ${dto.orderId} does not exist`);
            return CONTACT_RESPONSES.CONTACT_NOT_FOUND();
        }
        const data   ={
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            companyName: dto.companyName,
            queryOn: dto.queryOn,
            orderId: existingOrderResponse.data, 
            description: dto.description,
            isActive: dto.isActive,
            createdBy: existingUser,
            updatedBy: null,
            createdAt: new Date(),
            updateAt : new Date(),
        }
        const result = this.contactRepository.create(data);
        await this.contactRepository.save(result);
        const context ={
            firstName: dto.firstName,
            createData: result.createdAt,
            id:result.id,
            status : result.isActive ? "Active" : "Non-active" ,
            lastName: dto.lastName,
            email: dto.email,
            companyName: dto.companyName,
            queryOn: dto.queryOn,
            description: dto.description
        }
        await this.mailerService.sendMail(
            dto.email, 
            mailSubject.mailFunction.query,
            mailTemplates.mailFunction.query,
            context)


        return CONTACT_RESPONSES.CONTACT_CREATED(result);
    }catch(error){
        console.log(error)
    }
  }

  async findAll(): Promise<ContactsResponseWrapper> {
    try{
        const contacts = await this.contactRepository.find();
        if(contacts.length === 0){
            return CONTACT_RESPONSES.CONTACTS_NOT_FOUND();
        }
        else{
            return CONTACT_RESPONSES.CONTACTS_FETCHED(contacts);
        }
    }catch(error){
        console.log(error)
    }
  }

  async findOne(id: number): Promise<ContactResponseWrapper> {
    
    const contact = await this.contactRepository.findOneBy({ id });
    if (!contact){
        return CONTACT_RESPONSES.CONTACT_NOT_FOUND();
    }
    else{
        return CONTACT_RESPONSES.CONTACT_FETCHED(contact);
    }
    
  }

  async update(id: number, dto: UpdateContactDTO): Promise<ContactResponseWrapper> {

    const existingUser = await this.userRepository.findUserById(dto.updatedBy);
    if(!existingUser){
        this.logger.error(`User with ID ${dto.updatedBy} does not exist`);
        return USER_RESPONSES.USERS_NOT_FOUND();
    }

    const existingRecord = await this.findOne(id);
    if(!existingRecord) return CONTACT_RESPONSES.CONTACT_NOT_FOUND();
    const contact = await this.contactRepository.findOneBy({ id });
    Object.assign(contact, dto);
    await this.contactRepository.save(contact);
    return CONTACT_RESPONSES.CONTACT_UPDATED(contact);
  }

  async remove(id: number): Promise<ContactResponseWrapper> {
    const existingRecord = await this.findOne(id);
    if(!existingRecord) return CONTACT_RESPONSES.CONTACT_NOT_FOUND();

    const contact = await this.contactRepository.findOneBy({ id });
    if (!contact){
        this.logger.error(`Contact with ID ${id} does not exist`);
         return CONTACT_RESPONSES.CONTACT_FETCHED(contact);
    }

    const result = await this.contactRepository.remove(contact);
    return CONTACT_RESPONSES.CONTACT_DELETED(id);
  }
}
