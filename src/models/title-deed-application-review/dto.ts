import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/global.dto';

export class CreateTitleDeedApplicationReviewDto {
  @ApiProperty({ description: 'VERIFICATION or AUTHORIZATION' })
  @IsNotEmpty()
  @IsString()
  action: string;
}

export class CreateManualTitleDeedApplicationReviewDto {
  @ApiProperty({ description: 'VERIFICATION or AUTHORIZATION' })
  @IsNotEmpty()
  @IsString()
  action: string;

  @ApiProperty({ description: 'Application number' })
  @IsNotEmpty()
  @IsString()
  application_no: string;
}

export class ArchiveTitleDeedApplicationReviewDto {
  @ApiProperty({ example: 'Review validated' })
  @IsOptional()
  archive_note: string;
}

export class VerifyTitleDeedApplicationReviewDto {
  @ApiProperty({ example: 'Review validated' })
  @IsOptional()
  verifier_note: string;
}

export class ValidateTitleDeedApplicationReviewDto {
  @ApiProperty({ example: 'Review validated' })
  @IsOptional()
  validator_note: string;

  @IsOptional()
  validated_by_id: string;
}

export class AuthorizeTitleDeedApplicationReviewDto {
  @ApiProperty({ example: 'Review validated' })
  @IsOptional()
  authorizer_note: string;

  @IsOptional()
  authorized_by_id: string;
}
export class RejectTitleDeedApplicationReviewDto {
  @ApiProperty({ example: 'Review rejected b/c of visibility' })
  @IsOptional()
  rejecter_note: string;

  @ApiProperty({ example: 'rejection reason id' })
  @IsOptional()
  rejection_reason_id: string;

  rejected_by_id: string;
}

export class SearchTitleDeedApplicationReviewDto extends PartialType(
  PaginationDto,
) {
  search?: string;
  role?: string;
  reviewer_id?: string;
}
