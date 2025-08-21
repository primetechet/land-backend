import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/database/database.service';
import {
  CreateTitleDeedServiceDocumentTypeDto,
  UpdateTitleDeedServiceDocumentTypeDto,
  SearchTitleDeedServiceDocumentTypeDto,
} from './dto';
import { paginate } from 'src/common/utils/paginater';

@Injectable()
export class TitleDeedServiceDocumentTypeService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(createDto: CreateTitleDeedServiceDocumentTypeDto) {
    return this.prisma.titleDeedServiceDocumentType.create({
      data: createDto,
    });
  }

  async findAll(query: SearchTitleDeedServiceDocumentTypeDto) {
    const { search, title_deed_service_id, document_type_id } = query;

    const where: any = {};

    if (title_deed_service_id)
      where.title_deed_service_id = title_deed_service_id;

    if (document_type_id) where.document_type_id = document_type_id;

    return this.prisma.titleDeedServiceDocumentType.findMany({
      where,
      include: {
        documentType: true,
        titleDeedService: true,
      },
    });
  }

  async findAllPaginated(query: SearchTitleDeedServiceDocumentTypeDto) {
    const {
      page = 1,
      limit = 10,
      search,
      title_deed_service_id,
      document_type_id,
    } = query;

    const where: any = {};

    if (title_deed_service_id)
      where.title_deed_service_id = title_deed_service_id;

    if (document_type_id) where.document_type_id = document_type_id;

    return paginate(
      this.prisma.titleDeedServiceDocumentType,
      {
        where,
        include: {
          documentType: true,
          titleDeedService: true,
        },
      },
      { page: +page, perPage: +limit },
    );
  }

  async findOne(id: string) {
    const record = await this.prisma.titleDeedServiceDocumentType.findUnique({
      where: { id },
      include: {
        documentType: true,
        titleDeedService: true,
      },
    });
    if (!record) throw new NotFoundException('Service document type not found');
    return record;
  }

  async update(id: string, updateDto: UpdateTitleDeedServiceDocumentTypeDto) {
    await this.findOne(id);
    return this.prisma.titleDeedServiceDocumentType.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.titleDeedServiceDocumentType.delete({ where: { id } });
  }
}
