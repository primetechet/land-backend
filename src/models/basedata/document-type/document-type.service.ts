import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import {
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
  SearchDocumentTypeDto,
} from './dto';
import { paginate } from 'src/common/utils/paginater';

@Injectable()
export class DocumentTypeService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreateDocumentTypeDto) {
    return this.prisma.documentType.create({
      data: createDto,
    });
  }

  async findAll(query: SearchDocumentTypeDto) {
    const { search } = query;
    return this.prisma.documentType.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
    });
  }

  async findAllPaginated(query: SearchDocumentTypeDto) {
    const { page = 1, limit = 10, search } = query;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { code: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return paginate(
      this.prisma.documentType,
      { where },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.documentType.findUnique({
      where: { id },
    });
    if (!record) throw new NotFoundException('Document type not found');
    return record;
  }

  async update(id: string, updateDto: UpdateDocumentTypeDto) {
    await this.findOne(id);
    return this.prisma.documentType.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.documentType.delete({ where: { id } });
  }
}
