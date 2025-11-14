import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { clientsApi } from '../api'
import type {
  Client,
  CreateClientDto,
  UpdateClientDto,
  PaginationQuery,
} from '../types'

export function useClients(query?: PaginationQuery) {
  const queryString = query
    ? `?page=${query.page || 1}&limit=${query.limit || 10}`
    : ''
  const { data, error, isLoading, mutate } = useSWR<{
    data: Client[]
    meta: any
  }>(`/clients${queryString}`, () => clientsApi.findAll(query))

  return {
    clients: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useClient(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Client>(
    id ? `/clients/${id}` : null,
    () =>
      (id ? clientsApi.findOne(id) : Promise.resolve(null)) as Promise<Client>
  )

  return {
    client: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useCreateClient() {
  const { trigger, isMutating } = useSWRMutation(
    '/clients',
    async (url, { arg }: { arg: CreateClientDto }) => {
      return clientsApi.create(arg)
    }
  )

  return {
    createClient: trigger,
    isCreating: isMutating,
  }
}

export function useUpdateClient() {
  const { trigger, isMutating } = useSWRMutation(
    '/clients',
    async (url, { arg }: { arg: { id: string; data: UpdateClientDto } }) => {
      return clientsApi.update(arg.id, arg.data)
    }
  )

  return {
    updateClient: trigger,
    isUpdating: isMutating,
  }
}

export function useDeleteClient() {
  const { trigger, isMutating } = useSWRMutation(
    '/clients',
    async (url, { arg }: { arg: string }) => {
      return clientsApi.delete(arg)
    }
  )

  return {
    deleteClient: trigger,
    isDeleting: isMutating,
  }
}
