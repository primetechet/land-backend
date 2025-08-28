import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { CountryModule } from './models/basedata/country/country.module';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
} from 'nestjs-i18n';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EmployeeAuthModule } from './models/auth/employee-auth/employee-auth.module';
import { TitleDeedApplicationModule } from './models/title-deed-application/title-deed-application.module';
import { TitleDeedServiceModule } from './models/basedata/title-deed-service/title-deed-service.module';
import { TitleDeedApplicationOwnerModule } from './models/title-deed-application-owner/title-deed-application-owner.module';
import { WoredaModule } from './models/basedata/woreda/woreda.module';
import { RegionModule } from './models/basedata/region/region.module';
import { DisabilityStatusModule } from './models/basedata/disability-status/disability-status.module';
import { OrganizationTypeModule } from './models/basedata/organization-type/organization-type.module';
import { BranchModule } from './models/basedata/branch/branch.module';
import { TitleDeedServiceBranchModule } from './models/basedata/title-deed-service-branch/title-deed-service-branch.module';
import { TitleDeedServiceRequirementModule } from './models/basedata/title-deed-service-requirement/title-deed-service-requirement.module';
import { DistrictModule } from './models/basedata/district/district.module';
import { TitleDeedServiceDocumentTypeModule } from './models/basedata/title-deed-service-document-type/title-deed-service-document-type.module';
import { DocumentTypeModule } from './models/basedata/document-type/document-type.module';
import { AuthModule } from './models/auth/auth/auth.module';
import { TitleDeedApplicationReviewModule } from './models/title-deed-application-review/title-deed-application-review.module';
import { MinioClientModule } from './common/minio-client/minio-client.module';
import { TitleDeedApplicationClientDocumentModule } from './models/title-deed-application-client-document/title-deed-application-client-document.module';
import { TitleDeedApplicationDocumentModule } from './models/title-deed-application-document/title-deed-application-document.module';
import { PermissionActionModule } from './models/auth/permission-action/permission-action.module';
import { PermissionResourceModule } from './models/auth/permission-resource/permission-resource.module';
import { RoleModule } from './models/auth/role/role.module';
import { LandUseModule } from './models/basedata/land-use/land-use.module';
import { LandGradeModule } from './models/basedata/land-grade/land-grade.module';
import { PlotModule } from './models/plot/plot.module';
import { PlotPropertyModule } from './models/plot-property/plot-property.module';
import { PropertyTypeModule } from './models/basedata/property-type/property-type.module';
import { PropertyUseModule } from './models/basedata/property-use/property-use.module';
import { TitleDeedApplicationPaymentModule } from './models/title-deed-application-payment/title-deed-application-payment.module';
import { AuthorizationModule } from './common/services/authorization.module';
import { TokenCleanupService } from './common/services/token-cleanup.service';
import { EmployeeModule } from './models/employee/employee.module';
import { RejectionReasonModule } from './models/basedata/rejection-reason/rejection-reason.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthorizationModule,
    CountryModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [new HeaderResolver(['x-lang']), AcceptLanguageResolver],
      typesOutputPath: path.join(__dirname, 'generated/i18n.generated.ts'), // <--- this generates TS types
    }),
    EmployeeAuthModule,
    TitleDeedApplicationModule,
    TitleDeedServiceModule,
    TitleDeedApplicationOwnerModule,
    WoredaModule,
    RegionModule,
    DisabilityStatusModule,
    OrganizationTypeModule,
    BranchModule,
    TitleDeedServiceBranchModule,
    TitleDeedServiceRequirementModule,
    DistrictModule,
    TitleDeedServiceDocumentTypeModule,
    DocumentTypeModule,
    AuthModule,
    TitleDeedApplicationReviewModule,
    MinioClientModule,
    TitleDeedApplicationClientDocumentModule,
    TitleDeedApplicationDocumentModule,
    PermissionActionModule,
    PermissionResourceModule,
    RoleModule,
    LandUseModule,
    LandGradeModule,
    PlotModule,
    PlotPropertyModule,
    PropertyTypeModule,
    PropertyUseModule,
    TitleDeedApplicationPaymentModule,
    EmployeeModule,
    RejectionReasonModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokenCleanupService],
})
export class AppModule {}
