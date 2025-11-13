import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { DealStatus } from '../entities/deal.entity';

export class DealQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: DealStatus })
  @IsOptional()
  @IsEnum(DealStatus)
  status?: DealStatus;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @Type(() => String)
  @IsUUID()
  clientId?: string;
}

