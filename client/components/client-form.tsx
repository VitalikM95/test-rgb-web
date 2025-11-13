'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { Client, CreateClientDto, UpdateClientDto } from '@/lib/types'

const clientSchema = z.object({
  name: z.string().min(1, "Ім'я обов'язкове").max(255, 'Максимум 255 символів'),
  email: z.string().email('Невалідний email').max(320, 'Максимум 320 символів'),
  phone: z
    .string()
    .max(30, 'Максимум 30 символів')
    .optional()
    .or(z.literal('')),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
  client?: Client
  onSubmit: (data: CreateClientDto | UpdateClientDto) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ClientForm({
  client,
  onSubmit,
  onCancel,
  isLoading,
}: ClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || '',
      email: client?.email || '',
      phone: client?.phone || '',
    },
  })

  const handleSubmit = async (data: ClientFormValues) => {
    const submitData: CreateClientDto | UpdateClientDto = {
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
    }

    try {
      // Очистка попередніх помилок
      form.clearErrors()
      await onSubmit(submitData)
    } catch (error: any) {
      // Якщо сервер повернув повідомлення про конкретне поле, встановлюємо через setError
      if (error?.response?.data?.field && error?.response?.data?.message) {
        form.setError(error.response.data.field as keyof ClientFormValues, {
          type: 'server',
          message: error.response.data.message,
        })
      } else if (error?.response?.data?.message) {
        // Якщо загальна помилка, виводимо на email (чи інше поле за замовчуванням)
        form.setError('email', {
          type: 'server',
          message: error.response.data.message,
        })
      } else {
        form.setError('email', {
          type: 'server',
          message: 'Сталася помилка. Спробуйте пізніше.',
        })
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ім'я *</FormLabel>
              <FormControl>
                <Input placeholder="Введіть ім'я" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Введіть email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Введіть телефон" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Скасувати
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Збереження...' : client ? 'Оновити' : 'Створити'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
