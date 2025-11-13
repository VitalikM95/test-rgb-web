// Типи на основі бекенду DTO та entities

export enum DealStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  WON = 'WON',
  LOST = 'LOST',
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  deals?: Deal[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Deal {
  id: string;
  title: string;
  amount: number;
  status: DealStatus;
  client: Client;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientDto {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}

export interface CreateDealDto {
  title: string;
  amount: number;
  status?: DealStatus;
  clientId: string;
}

export interface UpdateDealDto extends Partial<CreateDealDto> {}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface DealQuery extends PaginationQuery {
  status?: DealStatus;
  clientId?: string;
}

