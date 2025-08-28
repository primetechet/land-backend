import { HttpException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { PaginationDto } from 'src/common/dtos/global.dto';
import { paginate } from 'src/common/utils/paginater';
import { I18nTranslations } from 'src/generated/i18n.generated';
import {
  CreateTitleDeedApplicationClientDocumentDto,
  RejectTitleDeedApplicationClientDocumentDto,
  VerifyTitleDeedApplicationClientDocumentDto,
} from './dto';
import { TitleDeedApplicationClientDocument } from '@prisma/client';
import { DatabaseService } from 'src/common/database/database.service';
import { MinioClientService } from 'src/common/minio-client/minio-client.service';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@Injectable()
export class TitleDeedApplicationClientDocumentService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly minioClientService: MinioClientService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async create(
    data: CreateTitleDeedApplicationClientDocumentDto,
    attachments: any,
    request: EmployeeTokenClaim,
  ): Promise<TitleDeedApplicationClientDocument> {
    const files = await this.minioClientService.uploadSingleFile(
      attachments[0],
      'TITLE_DEED_DOCUMENT',
    );

    const titleDeedApplicationClientDocument =
      await this.prisma.titleDeedApplicationClientDocument.create({
        data: {
          title_deed_application_id: data.title_deed_application_id,
          title_deed_service_document_type_id:
            data.title_deed_service_document_type_id,
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

    return titleDeedApplicationClientDocument;
  }

  async verify(
    id: string,
    data: VerifyTitleDeedApplicationClientDocumentDto,
    request: EmployeeTokenClaim,
  ) {
    const titleDeedApplicationClientDocument =
      await this.prisma.titleDeedApplicationClientDocument.findUnique({
        where: { id: id },
      });

    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!employee) {
      throw new HttpException('', 422);
    }

    await this.prisma.titleDeedApplicationClientDocument.update({
      where: { id: id },
      data: {
        rejected: false,
        verified: true,
        verifier_note: data.verifier_note,
        verified_by_id: employee.id,
        verified_at: new Date(),
      },
    });

    return {
      data: titleDeedApplicationClientDocument,
      message: this.i18n.t('success-messages.resource-verified', {
        args: {
          Resource: 'license-application',
        },
      }),
    };
  }

  async reject(
    id: string,
    data: RejectTitleDeedApplicationClientDocumentDto,
    request: EmployeeTokenClaim,
  ) {
    const titleDeedApplicationClientDocument =
      await this.prisma.titleDeedApplicationClientDocument.findUnique({
        where: { id: id },
      });

    const employee = await this.prisma.employee.findUnique({
      where: { id: request.user.sub },
    });

    if (!employee) {
      throw new HttpException('', 422);
    }

    await this.prisma.titleDeedApplicationClientDocument.update({
      where: { id: id },
      data: {
        verified: false,
        rejected: true,
        rejecter_note: data.rejecter_note,
        rejected_by_id: employee.id,
        rejected_at: new Date(),
      },
    });

    return {
      data: titleDeedApplicationClientDocument,
      message: this.i18n.t('success-messages.resource-verified', {
        args: {
          Resource: 'license-application',
        },
      }),
    };
  }

  async findAllPaginated(options: PaginationDto) {
    return paginate(
      this.prisma.titleDeedApplicationClientDocument,
      {},
      { page: +options.page, perPage: +options.limit },
    );
  }
}
