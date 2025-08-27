import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RejectionReasonService } from './rejection-reason.service';
import {
  CreateRejectionReasonDto,
  UpdateRejectionReasonDto,
  SearchRejectionReasonDto,
} from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Rejection Reasons')
@Controller('rejection-reason')
export class RejectionReasonController {
  constructor(private readonly service: RejectionReasonService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rejection reason' })
  create(@Body() createDto: CreateRejectionReasonDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rejection reasons' })
  findAll(@Query() query: SearchRejectionReasonDto) {
    return this.service.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated rejection reasons' })
  findAllPaginated(@Query() query: SearchRejectionReasonDto) {
    return this.service.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a rejection reason by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rejection reason by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdateRejectionReasonDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rejection reason by ID' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
