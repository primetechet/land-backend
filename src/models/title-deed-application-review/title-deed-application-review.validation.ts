import { HttpException, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { VerifyTitleDeedApplicationReviewDto } from './dto';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class TitleDeedApplicationReviewValidator {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async verify(
    id: string,
    verifyTitleDeedApplicationReviewDto: VerifyTitleDeedApplicationReviewDto,
  ) {
    const titleDeedApplicationReview =
      await this.prisma.titleDeedApplicationReview.findUnique({
        where: {
          id: id,
        },
        select: {
          titleDeedApplication: {
            select: {
              title_deed_service_id: true,
              submitted: true,
              verified: true,
              id: true,
            },
          },
        },
      });

    if (!titleDeedApplicationReview) {
      throw new HttpException(
        this.i18n.t('error-messages.invalid-resource', {
          args: { Resource: 'title-deed-application' },
        }),
        422,
      );
    }

    if (!titleDeedApplicationReview.titleDeedApplication.submitted) {
      throw new HttpException(
        this.i18n.t('error-messages.not-submitted', {
          args: { Resource: 'title-deed-application' },
        }),
        422,
      );
    }

    if (titleDeedApplicationReview.titleDeedApplication.verified) {
      throw new HttpException(
        this.i18n.t('error-messages.already-verified', {
          args: { Resource: 'title-deed-application' },
        }),
        422,
      );
    }

    // const documentCategoryTypes =
    //   await this.prisma.titleDeedServiceDocumentType.findMany({
    //     where: {
    //       title_deed_service_id:
    //         titleDeedApplicationReview.titleDeedApplication
    //           .visaCategoryValidityType.visaCategory.document_category_id,
    //     },
    //     include: {
    //       titleDeedApplicationReviewDocuments: {
    //         orderBy: { created_at: 'desc' },
    //         where: {
    //           new_visa_application_id:
    //             titleDeedApplicationReview.titleDeedApplication.id,
    //         },
    //         select: {
    //           id: true,
    //           rejected: true,
    //           verified: true,
    //         },
    //       },
    //     },
    //   });

    // // Check if every document category has at least one verified document
    // const allCategoriesHaveVerifiedDocument = documentCategoryTypes.every(
    //   (category) => {
    //     // Ensure that at least one document in this category is verified
    //     return category.titleDeedApplicationReviewDocuments.some(
    //       (doc) => doc.verified,
    //     );
    //   },
    // );

    // if (!allCategoriesHaveVerifiedDocument) {
    //   throw new HttpException(
    //     this.i18n.t('error-messages.review-all-documents'),
    //     422,
    //   );
    // }

    return null;
  }
}
