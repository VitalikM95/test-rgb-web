import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { dealsApi } from '../api';
import type { Deal, CreateDealDto, UpdateDealDto, DealQuery } from '../types';

// Отримання списку угод з фільтрами
export function useDeals(query?: DealQuery) {
  const queryParams = new URLSearchParams();
  if (query?.page) queryParams.append('page', query.page.toString());
  if (query?.limit) queryParams.append('limit', query.limit.toString());
  if (query?.status) queryParams.append('status', query.status);
  if (query?.clientId) queryParams.append('clientId', query.clientId);
  
  const queryString = queryParams.toString();
  const { data, error, isLoading, mutate } = useSWR<{ data: Deal[]; meta: any }>(
    `/deals${queryString ? `?${queryString}` : ''}`,
    () => dealsApi.findAll(query),
  );

  return {
    deals: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    mutate,
  };
}

// Отримання однієї угоди
export function useDeal(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Deal>(
    id ? `/deals/${id}` : null,
    () => (id ? dealsApi.findOne(id) : null),
  );

  return {
    deal: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Створення угоди
export function useCreateDeal() {
  const { trigger, isMutating } = useSWRMutation(
    '/deals',
    async (url, { arg }: { arg: CreateDealDto }) => {
      return dealsApi.create(arg);
    },
  );

  return {
    createDeal: trigger,
    isCreating: isMutating,
  };
}

// Оновлення угоди
export function useUpdateDeal() {
  const { trigger, isMutating } = useSWRMutation(
    '/deals',
    async (url, { arg }: { arg: { id: string; data: UpdateDealDto } }) => {
      return dealsApi.update(arg.id, arg.data);
    },
  );

  return {
    updateDeal: trigger,
    isUpdating: isMutating,
  };
}

// Видалення угоди
export function useDeleteDeal() {
  const { trigger, isMutating } = useSWRMutation(
    '/deals',
    async (url, { arg }: { arg: string }) => {
      return dealsApi.delete(arg);
    },
  );

  return {
    deleteDeal: trigger,
    isDeleting: isMutating,
  };
}

