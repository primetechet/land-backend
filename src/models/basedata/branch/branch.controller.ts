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
import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto, SearchBranchDto } from './dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('basedata/Branches')
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new branch' })
  create(@Body() createDto: CreateBranchDto) {
    return this.branchService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all branches' })
  findAll(@Query() query: SearchBranchDto) {
    return this.branchService.findAll(query);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated branches' })
  findAllPaginated(@Query() query: SearchBranchDto) {
    return this.branchService.findAllPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a branch by ID' })
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a branch by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdateBranchDto) {
    return this.branchService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a branch by ID' })
  remove(@Param('id') id: string) {
    return this.branchService.remove(id);
  }
}
