import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  Patch,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, SearchRoleDto } from './dto/create-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { DatabaseService } from 'src/common/database/database.service';

@ApiTags('role')
@Controller('role')
@ApiBearerAuth()
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly prisma: DatabaseService,
  ) {}

  @Post()
  // @Resource([{ resource: RESOURCE.USER, actions: [ACTIONS.CREATE] }])
  async create(@Body() createRoleDto: CreateRoleDto) {
    const existingVehicleModel = await this.prisma.role.findFirst({
      where: {
        OR: [
          {
            name: createRoleDto.name,
          },
        ],
      },
    });

    if (existingVehicleModel) {
      throw new HttpException('Record already exists', 422);
    }

    return this.roleService.create(createRoleDto);
  }

  @Get('paginated')
  findAllPaginated(@Query() payload: any) {
    return this.roleService.findAllPaginated(payload);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  // @Resource([{ resource: RESOURCE.USER, actions: [ACTIONS.UPDATE] }])
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Resource([{ resource: RESOURCE.USER, actions: [ACTIONS.DELETE] }])
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
