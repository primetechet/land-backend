import { HttpException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { paginate } from 'src/common/utils/paginater';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { CreateTitleDeedApplicationDocumentDto } from './dto';
import { TitleDeedApplicationDocument } from '@prisma/client';
import { DatabaseService } from 'src/common/database/database.service';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';
import { MinioClientService } from 'src/common/minio-client/minio-client.service';

@Injectable()
export class TitleDeedApplicationDocumentService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly minioService: MinioClientService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async create(
    data: CreateTitleDeedApplicationDocumentDto,
    attachments: any,
    request: EmployeeTokenClaim,
  ): Promise<TitleDeedApplicationDocument> {
    const files = await this.minioService.uploadSingleFile(
      attachments[0],
      'TITLE_DEED_DOCUMENT',
    );

    const titleDeedApplicationDocument =
      await this.prisma.titleDeedApplicationDocument.create({
        data: {
          title_deed_application_id: data.title_deed_application_id,
          attachment: files,
          expires_at: data.expires_at
            ? new Date(data.expires_at).toISOString()
            : null,
          issued_at: data.issued_at
            ? new Date(data.issued_at).toISOString()
            : null,
          created_by_id: request.user.sub,
        },
      });

    return titleDeedApplicationDocument;
  }

  async findAllPaginated(options: PaginationDto) {
    return paginate(
      this.prisma.titleDeedApplicationDocument,
      {},
      { page: +options.page, perPage: +options.limit },
    );
  }

  async remove(id: string) {
    return this.prisma.titleDeedApplicationDocument.delete({ where: { id } });
  }
}
