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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
