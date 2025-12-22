import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { AttachmentEntity } from '../models/entity/attachment.entity';

@Injectable()
export class AttachmentsService {
  constructor(
    @InjectRepository(AttachmentEntity)
    private readonly attachmentRepository: Repository<AttachmentEntity>,
  ) {}

  async create(createAttachmentDto: CreateAttachmentDto) {
    const attachment = this.attachmentRepository.create(createAttachmentDto);
    return await this.attachmentRepository.save(attachment);
  }

  async findAll() {
    return await this.attachmentRepository.find();
  }

  async findOne(id: number) {
    return await this.attachmentRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateAttachmentDto: UpdateAttachmentDto) {
    await this.attachmentRepository.update(id, updateAttachmentDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.attachmentRepository.delete(id);
  }
}
