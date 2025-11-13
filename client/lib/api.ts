import axios from 'axios'
import type {
  Client,
  Deal,
  CreateClientDto,
  UpdateClientDto,
  CreateDealDto,
  UpdateDealDto,
  PaginatedResponse,
  PaginationQuery,
  DealQuery,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Clients API
export const clientsApi = {
  create: (data: CreateClientDto): Promise<Client> =>
    apiClient.post('/clients', data).then(res => res.data),

  findAll: (query?: PaginationQuery): Promise<PaginatedResponse<Client>> =>
    apiClient.get('/clients', { params: query }).then(res => res.data),

  findOne: (id: string): Promise<Client> =>
    apiClient.get(`/clients/${id}`).then(res => res.data),

  update: (id: string, data: UpdateClientDto): Promise<Client> =>
    apiClient.patch(`/clients/${id}`, data).then(res => res.data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/clients/${id}`).then(() => undefined),
}

// Deals API
export const dealsApi = {
  create: (data: CreateDealDto): Promise<Deal> =>
    apiClient.post('/deals', data).then(res => res.data),

  findAll: (query?: DealQuery): Promise<PaginatedResponse<Deal>> =>
    apiClient.get('/deals', { params: query }).then(res => res.data),

  findOne: (id: string): Promise<Deal> =>
    apiClient.get(`/deals/${id}`).then(res => res.data),

  update: (id: string, data: UpdateDealDto): Promise<Deal> =>
    apiClient.patch(`/deals/${id}`, data).then(res => res.data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/deals/${id}`).then(() => undefined),
}
