import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreatePermissionActionDto,
  SearchPermissionActionDto,
} from './dto/create-permission-action.dto';
import { UpdatePermissionActionDto } from './dto/update-permission-action.dto';
import { PermissionActionService } from './permission-action.service';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';

@ApiTags('permission-action')
@Controller('permission-action')
@ApiBearerAuth()
export class PermissionActionController {
  constructor(private readonly permissionService: PermissionActionService) {}

  @Post()
  // @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.CREATE] }])
  async create(
    @Body() createPermissionActionActionDto: CreatePermissionActionDto,
  ) {
    return this.permissionService.create(createPermissionActionActionDto);
  }

  @Get()
  async findAll() {
    return this.permissionService.findAll();
  }

  @Get('paginated')
  findAllPaginated(@Query() payload: SearchPermissionActionDto) {
    return this.permissionService.findAllPaginated(payload);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  async update(
    @Param('id') id: string,
    @Body() updatePermissionActionActionDto: UpdatePermissionActionDto,
  ) {
    return this.permissionService.update(id, updatePermissionActionActionDto);
  }

  @Delete(':id')
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  async remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
