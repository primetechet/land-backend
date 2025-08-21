import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTitleDeedApplicationClientDocumentDto {
  @ApiProperty({
    description: 'Id of TitleDeedApplicationClient',
    type: Number,
  })
  @IsNotEmpty()
  title_deed_application_id: string;

  @ApiProperty({ description: 'Id of document category type', type: Number })
  @IsNotEmpty()
  title_deed_service_document_type_id: string;

  @ApiProperty({ example: '2023/03/03', type: Date })
  @IsOptional()
  issued_at: string;

  @ApiProperty({ example: '2023/03/03', type: Date })
  @IsOptional()
  expires_at: string;
}

export class VerifyTitleDeedApplicationClientDocumentDto {
  @ApiProperty({ example: 'Document validated' })
  @IsOptional()
  verifier_note: string;

  verified_by_id: string;
}

export class RejectTitleDeedApplicationClientDocumentDto {
  @ApiProperty({ example: 'Document rejected b/c of visibility' })
  @IsOptional()
  rejecter_note: string;

  rejected_by_id: string;
}
