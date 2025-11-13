'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ClientForm } from '@/components/client-form'
import { DealForm } from '@/components/deal-form'
import {
  useClient,
  useUpdateClient,
  useDeleteClient,
} from '@/lib/hooks/use-clients'
import { useClients } from '@/lib/hooks/use-clients'
import { useCreateDeal, useDeleteDeal } from '@/lib/hooks/use-deals'
import type { UpdateClientDto, CreateDealDto, UpdateDealDto } from '@/lib/types'
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react'
import { DealStatus } from '@/lib/types'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDealDialogOpen, setIsCreateDealDialogOpen] = useState(false)
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null)

  const { client, isLoading, mutate } = useClient(id)
  const { clients } = useClients({ page: 1, limit: 1000 }) // Отримуємо всіх клієнтів для вибору
  const { updateClient, isUpdating } = useUpdateClient()
  const { deleteClient } = useDeleteClient()
  const { createDeal, isCreating } = useCreateDeal()
  const { deleteDeal, isDeleting } = useDeleteDeal()

  const handleUpdate = async (data: UpdateClientDto) => {
    if (!client) return
    try {
      await updateClient({ id: client.id, data })
      await mutate()
      setIsEditDialogOpen(false)
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async () => {
    if (!client) return
    if (
      confirm(
        'Ви впевнені, що хочете видалити цього клієнта? Всі його угоди також будуть видалені.'
      )
    ) {
      await deleteClient(client.id)
      router.push('/clients')
    }
  }

  const handleCreateDeal = async (data: CreateDealDto) => {
    await createDeal({ ...data, clientId: id })
    await mutate()
    setIsCreateDealDialogOpen(false)
  }

  const handleDeleteDeal = async (dealId: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю угоду?')) {
      await deleteDeal(dealId)
      await mutate()
      setDeletingDealId(null)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
    }).format(amount)
  }

  const statusLabels: Record<DealStatus, string> = {
    [DealStatus.NEW]: 'Нова',
    [DealStatus.IN_PROGRESS]: 'В процесі',
    [DealStatus.WON]: 'Виграна',
    [DealStatus.LOST]: 'Програна',
  }

  const statusColors: Record<DealStatus, string> = {
    [DealStatus.NEW]: 'bg-blue-100 text-blue-800',
    [DealStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [DealStatus.WON]: 'bg-green-100 text-green-800',
    [DealStatus.LOST]: 'bg-red-100 text-red-800',
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Завантаження...</div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Клієнта не знайдено</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link href="/clients">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад до клієнтів
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{client.name}</CardTitle>
                <CardDescription>Інформація про клієнта</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Редагувати
                </Button>
                <Button variant="outline" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Видалити
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-lg">{client.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Телефон
                </p>
                <p className="text-lg">{client.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Створено
                </p>
                <p className="text-lg">{formatDate(client.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Оновлено
                </p>
                <p className="text-lg">{formatDate(client.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Угоди</CardTitle>
                <CardDescription>
                  Всього угод: {client.deals?.length || 0}
                </CardDescription>
              </div>
              <Button onClick={() => setIsCreateDealDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Додати угоду
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!client.deals || client.deals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Немає угод. Створіть першу угоду.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Назва</TableHead>
                    <TableHead>Сума</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Створено</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.deals.map(deal => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-medium">
                        {deal.title}
                      </TableCell>
                      <TableCell>{formatCurrency(deal.amount)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[deal.status]
                          }`}
                        >
                          {statusLabels[deal.status]}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(deal.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDeal(deal.id)}
                          disabled={isDeleting && deletingDealId === deal.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагувати клієнта</DialogTitle>
            <DialogDescription>
              Внесіть зміни до інформації про клієнта
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            client={client}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditDialogOpen(false)}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateDealDialogOpen}
        onOpenChange={setIsCreateDealDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Створити угоду</DialogTitle>
            <DialogDescription>
              Заповніть форму для створення нової угоди
            </DialogDescription>
          </DialogHeader>
          <DealForm
            clients={clients}
            onSubmit={
              handleCreateDeal as (
                data: CreateDealDto | UpdateDealDto
              ) => Promise<void>
            }
            onCancel={() => setIsCreateDealDialogOpen(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
