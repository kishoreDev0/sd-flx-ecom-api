import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from 'src/main/entities/contact-us.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectRepository(Contact)
    private readonly repo: Repository<Contact>,
  ) {}

  create(data: Partial<Contact>) {
    return this.repo.create(data);
  }

  async save(feature: Contact) {
    return this.repo.save(feature);
  }

  async deleteById(id: number) {
    return this.repo.delete(id);
  }

  async findById(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }

  async getAllContacts(): Promise<Contact[]> {
  return this.repo.find({
    relations: ['createdBy', 'updatedBy'],
  });
}

}
