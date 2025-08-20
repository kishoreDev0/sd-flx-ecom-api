import { Injectable } from '@nestjs/common';
import { FaqRepository } from '../repository/faq.repository';
import { CreateFaqDTO } from '../dto/requests/faq/create-faq.dto';
import { UpdateFaqDTO } from '../dto/requests/faq/update-faq.dto';
import { UserRepository } from '../repository/user.repository';
import {
  FaqResponseWrapper,
  FaqsResponseWrapper,
} from '../dto/responses/faq.response.dto';
    import { LoggerService } from './logger.service';
import { USER_RESPONSES } from '../commons/constants/response-constants/user.constant'; 
import { FAQ_RESPONSES } from '../commons/constants/response-constants/faq.constant';

@Injectable()
export class FaqService {
  constructor(
    private readonly repo: FaqRepository,
    private readonly userRepo: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  async create(dto: CreateFaqDTO): Promise<FaqResponseWrapper> {
  try {
    const creator = await this.userRepo.findUserById(dto.createdBy);
    if (!creator){ 
        this.logger.error('Creator user not found');
        return USER_RESPONSES.USERS_NOT_FOUND();
    }

    const user = await this.userRepo.findUserById(dto.createdBy);
    if (!user) {
        this.logger.error('User not found');
        return USER_RESPONSES.USERS_NOT_FOUND();
    }

    const response  = await this.repo.create({
        question: dto.question,
        answer: dto.answer,
        createdBy: user,
        updatedBy: user,
    });
    const savedFaq = await this.repo.save(response);

    return FAQ_RESPONSES.FAQ_CREATED(savedFaq);
   
  } catch (error) {
    this.logger.error(error);
    throw error;
  }
}


  async update(id: number, dto: UpdateFaqDTO): Promise<FaqResponseWrapper> {
    try {
      const updater = await this.userRepo.findUserById(dto.updatedBy);
        if (!updater) {
            this.logger.error('Updater user not found');
            return USER_RESPONSES.USERS_NOT_FOUND();
        }

        const faq = await this.repo.findById(id);
        Object.assign(faq, dto, { updatedBy: updater });
        const updatedFaq = await this.repo.save(faq);

        return FAQ_RESPONSES.FAQ_UPDATED(updatedFaq);
    } catch (error) {
      throw error;
    }
  }



  async getAllFaqs(): Promise<FaqsResponseWrapper> {
    try {
      const faq = await this.repo.getAll();
      if (!faq.length) {
        this.logger.warn('No FAQs found');
        return FAQ_RESPONSES.FAQ_NOT_FOUND();
      }

      return FAQ_RESPONSES.FAQS_FETCHED(faq);
    } catch (error) {
      throw error;
    }
  }

  async getFaqById(id: number): Promise<FaqResponseWrapper> {
    try {
      const faq = await this.repo.findById(id);
      if (!faq) {
        this.logger.warn(`FAQ with ID ${id} not found`);
        return FAQ_RESPONSES.FAQ_NOT_FOUND();
      }

      return FAQ_RESPONSES.FAQ_BY_ID_FETCHED(faq)
    } catch (error) {
      throw error;
    }
  }

 


  async delete(id: number): Promise<FaqResponseWrapper> {
    try {
      const faq = await this.repo.findById(id);
      if (!faq) {
        this.logger.warn(`FAQ with ID ${id} not found`);
        return FAQ_RESPONSES.FAQ_NOT_FOUND();
      }

      await this.repo.delete(id);

      return FAQ_RESPONSES.FAQ_DELETED(id);
    } catch (error) {
      throw error;
    }
  }


}