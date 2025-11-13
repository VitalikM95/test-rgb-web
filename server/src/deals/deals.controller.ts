import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { DealQueryDto } from './dto/deal-query.dto';
import { Deal } from './entities/deal.entity';
import { DealsPaginatedResponseDto } from './dto/deals-paginated-response.dto';

@ApiTags('deals')
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post()
  @ApiCreatedResponse({ type: Deal })
  create(@Body() dto: CreateDealDto): Promise<Deal> {
    return this.dealsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: DealsPaginatedResponseDto })
  findAll(@Query() query: DealQueryDto) {
    return this.dealsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: Deal })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Deal> {
    return this.dealsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Deal })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDealDto): Promise<Deal> {
    return this.dealsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Угоду успішно видалено' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.dealsService.remove(id);
  }
}

