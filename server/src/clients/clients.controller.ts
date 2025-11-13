import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Client } from './entities/client.entity';
import { ClientsPaginatedResponseDto } from './dto/clients-paginated-response.dto';

@ApiTags('clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiCreatedResponse({ type: Client })
  create(@Body() dto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: ClientsPaginatedResponseDto })
  findAll(@Query() query: PaginationQueryDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Client })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Client> {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Client })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateClientDto): Promise<Client> {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Клієнта успішно видалено' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.clientsService.remove(id);
  }
}

