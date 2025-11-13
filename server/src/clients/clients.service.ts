import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryFailedError, Repository } from 'typeorm'
import { buildPaginatedResponse } from '../common/utils/pagination.util'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto'
import { Client } from './entities/client.entity'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto'

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create(dto)

    try {
      return await this.clientsRepository.save(client)
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23505'
      ) {
        throw new ConflictException('Клієнт з таким email вже існує')
      }
      throw error
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<Client>> {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const [data, total] = await this.clientsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    return buildPaginatedResponse(data, total, page, limit)
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientsRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.deals', 'deal')
      .where('client.id = :id', { id })
      .orderBy('deal.createdAt', 'DESC')
      .getOne()

    if (!client) {
      throw new NotFoundException(`Клієнта з id ${id} не знайдено`)
    }

    return client
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.clientsRepository.preload({
      id,
      ...dto,
    })

    if (!client) {
      throw new NotFoundException(`Клієнта з id ${id} не знайдено`)
    }

    return this.clientsRepository.save(client)
  }

  async remove(id: string): Promise<void> {
    const client = await this.clientsRepository.findOne({
      where: { id },
    })

    if (!client) {
      throw new NotFoundException(`Клієнта з id ${id} не знайдено`)
    }

    await this.clientsRepository.remove(client)
  }
}
