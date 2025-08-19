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
import { SearchPermissionActionDto } from '../permission-action/dto/create-permission-action.dto';
import { CreatePermissionResourceDto } from './dto/create-permission-resource.dto';
import { UpdatePermissionResourceDto } from './dto/update-permission-resource.dto';
import { PermissionResourceService } from './permission-resource.service';
import { ACTIONS } from 'src/common/constants/actions';
import { RESOURCE } from 'src/common/constants/resource';
import { Resource } from 'src/common/decorators/resource.decorator';

@ApiTags('permission-resource')
@Controller('permission-resource')
@ApiBearerAuth()
export class PermissionResourceController {
  constructor(
    private readonly permissionResourceService: PermissionResourceService,
  ) {}

  @Post()
  // @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.CREATE] }])
  create(@Body() createPermissionResourceDto: CreatePermissionResourceDto) {
    return this.permissionResourceService.create(createPermissionResourceDto);
  }

  @Get('paginated')
  findAllPaginated(@Query() payload: SearchPermissionActionDto) {
    return this.permissionResourceService.findAllPaginated(payload);
  }

  @Get()
  findAll(@Query() payload: SearchPermissionActionDto) {
    return this.permissionResourceService.findAll(payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionResourceService.findOne(id);
  }

  @Patch(':id')
  // @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.UPDATE] }])
  update(
    @Param('id') id: string,
    @Body() updatePermissionResourceDto: UpdatePermissionResourceDto,
  ) {
    return this.permissionResourceService.update(
      id,
      updatePermissionResourceDto,
    );
  }

  @Delete(':id')
  @Resource([{ resource: RESOURCE.CONFIGURATION, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.permissionResourceService.remove(id);
  }
}
