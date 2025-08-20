import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto';
import { UpdateCountryDto } from './dto';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { DatabaseService } from 'src/common/database/database.service';
import { Resource } from 'src/common/decorators/resource.decorator';

@ApiTags('country')
@ApiBearerAuth()
@Controller('country')
export class CountryController {
  constructor(
    private readonly countryService: CountryService,
    private readonly prisma: DatabaseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new country' })
  @ApiResponse({ status: 201, description: 'Country created successfully.' })
  @ApiResponse({ status: 422, description: 'Record already exists.' })
  // @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.CREATE] }])
  async create(@Request() request, @Body() createCountryDto: CreateCountryDto) {
    const existingCountry = await this.prisma.country.findFirst({
      where: {
        name: createCountryDto.name,
      },
    });

    if (existingCountry) {
      throw new HttpException(
        'Record already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    console.log(request.user);

    return this.countryService.create(createCountryDto, request);
  }

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ status: 200, description: 'List of countries.' })
  findAll(@Query() payload: any) {
    return this.countryService.findAll(payload);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated list of countries' })
  @ApiResponse({ status: 200, description: 'Paginated list of countries.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaginated(@Query() payload: any) {
    return this.countryService.findAllPaginated(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a country by ID' })
  @ApiResponse({ status: 200, description: 'Country details.' })
  @ApiParam({ name: 'id', description: 'Country ID', type: String })
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a country by ID' })
  @ApiResponse({ status: 200, description: 'Country updated successfully.' })
  @ApiParam({ name: 'id', description: 'Country ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countryService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a country by ID' })
  @ApiResponse({ status: 200, description: 'Country deleted successfully.' })
  @ApiParam({ name: 'id', description: 'Country ID', type: String })
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.countryService.remove(id);
  }
}
