import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTitleDeedApplicationDocumentDto {
  @ApiProperty({
    description: 'Id of TitleDeedApplication',
    type: Number,
  })
  @IsNotEmpty()
  title_deed_application_id: string;

  @ApiProperty({ example: '2023/03/03', type: Date })
  @IsOptional()
  issued_at: string;

  @ApiProperty({ example: '2023/03/03', type: Date })
  @IsOptional()
  expires_at: string;
}
