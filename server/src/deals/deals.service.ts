import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { Deal } from './entities/deal.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { DealQueryDto } from './dto/deal-query.dto';
import { buildPaginatedResponse } from '../common/utils/pagination.util';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealsRepository: Repository<Deal>,
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  async create(dto: CreateDealDto): Promise<Deal> {
    const client = await this.clientsRepository.findOne({ where: { id: dto.clientId } });

    if (!client) {
      throw new NotFoundException(`Клієнта з id ${dto.clientId} не знайдено`);
    }

    const deal = this.dealsRepository.create({
      title: dto.title,
      amount: dto.amount,
      client,
      ...(dto.status ? { status: dto.status } : {}),
    });

    return this.dealsRepository.save(deal);
  }

  async findAll(query: DealQueryDto): Promise<PaginatedResponseDto<Deal>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.dealsRepository
      .createQueryBuilder('deal')
      .leftJoinAndSelect('deal.client', 'client')
      .orderBy('deal.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.status) {
      qb.andWhere('deal.status = :status', { status: query.status });
    }

    if (query.clientId) {
      qb.andWhere('client.id = :clientId', { clientId: query.clientId });
    }

    const [data, total] = await qb.getManyAndCount();

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string): Promise<Deal> {
    const deal = await this.dealsRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!deal) {
      throw new NotFoundException(`Угоду з id ${id} не знайдено`);
    }

    return deal;
  }

  async update(id: string, dto: UpdateDealDto): Promise<Deal> {
    const deal = await this.dealsRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!deal) {
      throw new NotFoundException(`Угоду з id ${id} не знайдено`);
    }

    if (dto.clientId && dto.clientId !== deal.client.id) {
      const client = await this.clientsRepository.findOne({ where: { id: dto.clientId } });

      if (!client) {
        throw new NotFoundException(`Клієнта з id ${dto.clientId} не знайдено`);
      }

      deal.client = client;
    }

    if (dto.title !== undefined) {
      deal.title = dto.title;
    }

    if (dto.amount !== undefined) {
      deal.amount = dto.amount;
    }

    if (dto.status !== undefined) {
      deal.status = dto.status;
    }

    return this.dealsRepository.save(deal);
  }

  async remove(id: string): Promise<void> {
    const deal = await this.dealsRepository.findOne({
      where: { id },
    });

    if (!deal) {
      throw new NotFoundException(`Угоду з id ${id} не знайдено`);
    }

    await this.dealsRepository.remove(deal);
  }
}

