import { Injectable } from '@nestjs/common';
import { CreateCountryDto, SearchCountryDto } from './dto';
import { UpdateCountryDto } from './dto';
import { Country } from '@prisma/client';
import { paginate } from 'src/common/utils/paginater';
import { DatabaseService } from 'src/common/database/database.service';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(
    data: CreateCountryDto,
    request: EmployeeTokenClaim,
  ): Promise<Country> {
    const country = await this.prisma.country.create({
      data: {
        name: data.name,
        country_code: data.country_code,
        nationality: data.nationality,
        draft: data.draft,
        description: data.description,
        name_json: data.name_json,
        description_json: data.description_json,
        nationality_json: data.nationality_json,
        created_by_id: request.user.sub,
      },
    });

    return country;
  }

  async update(id: string, data: UpdateCountryDto): Promise<Country> {
    const country = await this.prisma.country.update({
      data: {
        name: data.name,
        country_code: data.country_code,
        nationality: data.nationality,
        draft: data.draft,
        description: data.description,
        name_json: data.name_json,
        description_json: data.description_json,
        nationality_json: data.nationality_json,
      },
      where: { id: id },
    });

    return country;
  }

  findAll(options: SearchCountryDto) {
    const {
      accept_passport,
      accept_origin_id,
      accept_residency,
      accept_visa,
      search,
      has_branch,
    } = { ...options };
    const where: any = {};

    if (search) {
      where.name = {
        contains: search, // Use 'contains' for a case-insensitive search
        mode: 'insensitive', // Ensure the search is case-insensitive
      };
    }

    if (has_branch == 'true') {
      where.draft = false;
      where.regions = {
        some: {
          draft: false,
          branches: {
            some: {
              draft: false,
            },
          },
        },
      };
    }

    if (accept_passport) {
      where.regions = {
        some: {
          draft: false,
          branches: {
            some: {
              draft: false,
              accept_passport: true,
            },
          },
        },
      };
    }

    if (accept_origin_id) {
      where.regions = {
        some: {
          draft: false,
          branches: {
            some: {
              draft: false,
              accept_origin_id: true,
            },
          },
        },
      };
    }

    if (accept_residency) {
      where.regions = {
        some: {
          draft: false,
          branches: {
            some: {
              draft: false,
              accept_residency: true,
            },
          },
        },
      };
    }

    if (accept_visa) {
      where.regions = {
        some: {
          draft: false,
          branches: {
            some: {
              draft: false,
              accept_visa: true,
            },
          },
        },
      };
    }

    return this.prisma.country.findMany({
      where,
      select: {
        id: true,
        name: true,
        country_code: true,
        nationality: true,
        flag: true,
        description: true,
        draft: true,
      },
    });
  }

  async findAllPaginated(options: SearchCountryDto) {
    const { search } = { ...options };
    const where: any = {};

    if (search) {
      where.name = {
        contains: search, // Use 'contains' for a case-insensitive search
        mode: 'insensitive', // Ensure the search is case-insensitive
      };
    }

    return paginate(
      this.prisma.country,
      { where },
      { page: +options.page, perPage: +options.limit },
    );
  }

  findOne(id: string) {
    return this.prisma.country.findUnique({ where: { id: id } });
  }

  remove(id: string) {
    return this.prisma.country.delete({ where: { id: id } });
  }
}
