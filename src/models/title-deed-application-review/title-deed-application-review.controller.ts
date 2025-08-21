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
    private readonly newVisaApplicationReviewService: TitleDeedApplicationReviewService,
    private readonly newVisaApplicationReviewValidator: TitleDeedApplicationReviewValidator,
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
    return this.newVisaApplicationReviewService.create(
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
  //   return this.newVisaApplicationReviewService.createManual(
  //     request,
  //     createManualTitleDeedApplicationReviewDto,
  //   );
  // }

  @Get('completed')
  @ApiOperation({
    summary: 'Get paginated list of completed visa application reviews',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of visa applications.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Resource([
    {
      resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
      actions: [ACTIONS.READ],
    },
  ])
  findAllPaginated(
    @Request() request: EmployeeTokenClaim,
    @Query() payload: any,
  ) {
    payload.reviewer_id = request.user.sub;
    return this.newVisaApplicationReviewService.findAllPaginated(payload);
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
    return this.newVisaApplicationReviewService.findOne(id);
  }

  @Post(':id/verify')
  @Resource([
    {
      resource: RESOURCE.TITLE_DEED_APPLICATION_REVIEW,
      actions: [ACTIONS.VERIFY],
    },
  ])
  async verify(
    @Request() request,
    @Param('id') id: string,
    @Body()
    verifyTitleDeedApplicationReviewDto: VerifyTitleDeedApplicationReviewDto,
  ) {
    verifyTitleDeedApplicationReviewDto.verified_by_id = request.user.sub;

    await this.newVisaApplicationReviewValidator.verify(
      id,
      verifyTitleDeedApplicationReviewDto,
    );

    return this.newVisaApplicationReviewService.verify(
      id,
      verifyTitleDeedApplicationReviewDto,
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

    return this.newVisaApplicationReviewService.authorize(
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

    return this.newVisaApplicationReviewService.reject(
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
    return this.newVisaApplicationReviewService.close(
      id,
      request,
      closeTitleDeedApplicationReviewDto,
    );
  }
}
