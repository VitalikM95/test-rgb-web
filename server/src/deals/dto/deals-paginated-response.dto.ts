import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto, PaginationMetaDto } from '../../common/dto/paginated-response.dto';
import { Deal } from '../entities/deal.entity';

export class DealsPaginatedResponseDto extends PaginatedResponseDto<Deal> {
  @ApiProperty({ type: () => [Deal] })
  data: Deal[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}

