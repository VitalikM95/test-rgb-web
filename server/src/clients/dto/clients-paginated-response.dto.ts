import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto, PaginationMetaDto } from '../../common/dto/paginated-response.dto';
import { Client } from '../entities/client.entity';

export class ClientsPaginatedResponseDto extends PaginatedResponseDto<Client> {
  @ApiProperty({ type: () => [Client] })
  data: Client[];

  @ApiProperty({ type: () => PaginationMetaDto })
  meta: PaginationMetaDto;
}

