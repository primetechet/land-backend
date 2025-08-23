import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import {
  ArchiveTitleDeedApplicationReviewDto,
  AuthorizeTitleDeedApplicationReviewDto,
  CreateManualTitleDeedApplicationReviewDto,
  CreateTitleDeedApplicationReviewDto,
  RejectTitleDeedApplicationReviewDto,
  ValidateTitleDeedApplicationReviewDto,
  VerifyTitleDeedApplicationReviewDto,
} from './dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Resource } from 'src/common/decorators/resource.decorator';
import { RESOURCE } from 'src/common/constants/resource';
import { ACTIONS } from 'src/common/constants/actions';
import { TitleDeedApplicationReviewService } from './title-deed-application-review.service';
import { TitleDeedApplicationReviewValidator } from './title-deed-application-review.validation';
import { EmployeeTokenClaim } from 'src/common/interfaces/employee-login.interface';

@Controller('title-deed-application-review')
export class TitleDeedApplicationReviewController {
  constructor(
    private readonly titleDeedApplicationReviewService: TitleDeedApplicationReviewService,
    private readonly titleDeedApplicationReviewValidator: TitleDeedApplicationReviewValidator,
  ) {}

  @Post()
  // @Resource([
  //   {
  //     resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
  //     actions: [ACTIONS.CREATE],
  //   },
  // ])
  create(
    @Request() request: EmployeeTokenClaim,
    @Body()
    createTitleDeedApplicationReviewDto: CreateTitleDeedApplicationReviewDto,
  ) {
    return this.titleDeedApplicationReviewService.create(
      request,
      createTitleDeedApplicationReviewDto,
    );
  }

  // @Post('manual')
  // @Resource([
  //   {
  //     resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
  //     actions: [ACTIONS.CREATE],
  //   },
  // ])
  // createManual(
  //   @Request() request: EmployeeTokenClaim,
  //   @Body()
  //   createManualTitleDeedApplicationReviewDto: CreateManualTitleDeedApplicationReviewDto,
  // ) {
  //   return this.titleDeedApplicationReviewService.createManual(
  //     request,
  //     createManualTitleDeedApplicationReviewDto,
  //   );
  // }

  @Get('mine')
  @ApiOperation({
    summary: 'Get paginated list of mine visa application reviews',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of visa applications.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  // @Resource([
  //   {
  //     resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
  //     actions: [ACTIONS.READ],
  //   },
  // ])
  findAllPaginated(
    @Request() request: EmployeeTokenClaim,
    @Query() payload: any,
  ) {
    payload.reviewer_id = request.user.sub;
    return this.titleDeedApplicationReviewService.findAllPaginated(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a resource by ID' })
  // @Resource([
  //   {
  //     resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
  //     actions: [ACTIONS.READ_ONE],
  //   },
  // ])
  findOne(@Param('id') id: string, @Request() request: EmployeeTokenClaim) {
    console.log(id);
    return this.titleDeedApplicationReviewService.findOne(id);
  }

  @Post(':id/archive')
  // @Resource([
  //   {
  //     resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
  //     actions: [ACTIONS.VERIFY],
  //   },
  // ])
  async archive(
    @Request() request,
    @Param('id') id: string,
    @Body()
    archiveTitleDeedApplicationReviewDto: ArchiveTitleDeedApplicationReviewDto,
  ) {
    return this.titleDeedApplicationReviewService.archive(
      id,
      archiveTitleDeedApplicationReviewDto,
      request,
    );
  }

  @Post(':id/verify')
  // @Resource([
  //   {
  //     resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
  //     actions: [ACTIONS.VERIFY],
  //   },
  // ])
  async verify(
    @Request() request,
    @Param('id') id: string,
    @Body()
    verifyTitleDeedApplicationReviewDto: VerifyTitleDeedApplicationReviewDto,
  ) {
    await this.titleDeedApplicationReviewValidator.verify(
      id,
      verifyTitleDeedApplicationReviewDto,
    );

    return this.titleDeedApplicationReviewService.verify(
      id,
      verifyTitleDeedApplicationReviewDto,
      request,
    );
  }

  @Post(':id/authorize')
  @Resource([
    {
      resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
      actions: [ACTIONS.AUTHORIZE],
    },
  ])
  authorize(
    @Request() request,
    @Param('id') id: string,
    @Body()
    authorizeTitleDeedApplicationReviewDto: AuthorizeTitleDeedApplicationReviewDto,
  ) {
    authorizeTitleDeedApplicationReviewDto.authorized_by_id = request.user.sub;

    return this.titleDeedApplicationReviewService.authorize(
      id,
      authorizeTitleDeedApplicationReviewDto,
    );
  }

  @Post(':id/reject')
  @Resource([
    {
      resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
      actions: [ACTIONS.REJECT],
    },
  ])
  reject(
    @Request() request,
    @Param('id') id: string,
    @Body()
    rejectTitleDeedApplicationReviewDto: RejectTitleDeedApplicationReviewDto,
  ) {
    rejectTitleDeedApplicationReviewDto.rejected_by_id = request.user.sub;

    return this.titleDeedApplicationReviewService.reject(
      id,
      rejectTitleDeedApplicationReviewDto,
    );
  }

  @Post(':id/close')
  @Resource([
    {
      resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
      actions: [ACTIONS.CLOSE],
    },
  ])
  async close(
    @Request() request: EmployeeTokenClaim,
    @Param('id') id: string,
    @Body()
    closeTitleDeedApplicationReviewDto: { note: string },
  ) {
    return this.titleDeedApplicationReviewService.close(
      id,
      request,
      closeTitleDeedApplicationReviewDto,
    );
  }
}
