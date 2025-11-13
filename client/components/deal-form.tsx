'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Deal, CreateDealDto, UpdateDealDto, DealStatus } from '@/lib/types';
import { DealStatus as DealStatusEnum } from '@/lib/types';
import { useMemo } from 'react';

const createDealSchema = z.object({
  title: z.string().min(1, 'Назва обов\'язкова').max(255, 'Максимум 255 символів'),
  amount: z.coerce.number().positive('Сума повинна бути більше 0'),
  status: z.nativeEnum(DealStatusEnum).optional(),
  clientId: z.string().uuid('Невалідний ID клієнта').min(1, 'Клієнт обов\'язковий'),
});

const updateDealSchema = z.object({
  title: z.string().min(1, 'Назва обов\'язкова').max(255, 'Максимум 255 символів').optional(),
  amount: z.coerce.number().positive('Сума повинна бути більше 0').optional(),
  status: z.nativeEnum(DealStatusEnum).optional(),
  clientId: z.string().uuid('Невалідний ID клієнта').optional(),
});

interface DealFormProps {
  deal?: Deal;
  clients: Array<{ id: string; name: string; email: string }>;
  onSubmit: (data: CreateDealDto | UpdateDealDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusLabels: Record<DealStatus, string> = {
  [DealStatusEnum.NEW]: 'Нова',
  [DealStatusEnum.IN_PROGRESS]: 'В процесі',
  [DealStatusEnum.WON]: 'Виграна',
  [DealStatusEnum.LOST]: 'Програна',
};

export function DealForm({ deal, clients, onSubmit, onCancel, isLoading }: DealFormProps) {
  const schema = useMemo(() => deal ? updateDealSchema : createDealSchema, [deal]);
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: deal?.title || '',
      amount: deal?.amount || 0,
      status: deal?.status || DealStatusEnum.NEW,
      clientId: deal?.client?.id || (clients[0]?.id || ''),
    },
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    const submitData: CreateDealDto | UpdateDealDto = {
      title: data.title,
      amount: data.amount,
      status: data.status,
      ...(data.clientId && { clientId: data.clientId }),
    };
    await onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Назва *</FormLabel>
              <FormControl>
                <Input placeholder="Введіть назву угоди" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сума *</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Статус</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Виберіть статус" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {!deal && (
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Клієнт *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Виберіть клієнта" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} ({client.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Скасувати
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Збереження...' : deal ? 'Оновити' : 'Створити'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

