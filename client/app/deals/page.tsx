'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DealForm } from '@/components/deal-form'
import {
  useDeals,
  useCreateDeal,
  useUpdateDeal,
  useDeleteDeal,
} from '@/lib/hooks/use-deals'
import { useClients } from '@/lib/hooks/use-clients'
import type {
  Deal,
  CreateDealDto,
  UpdateDealDto,
  DealStatus,
} from '@/lib/types'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { DealStatus as DealStatusEnum } from '@/lib/types'
import { ConfirmDialog } from '@/components/confirm-dialog'

export default function DealsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<DealStatus | 'all'>('all')
  const [clientFilter, setClientFilter] = useState<string | 'all'>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null)

  const { deals, meta, isLoading, mutate } = useDeals({
    page,
    limit: 10,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    clientId: clientFilter !== 'all' ? clientFilter : undefined,
  })

  const { clients } = useClients({ page: 1, limit: 1000 })
  const { createDeal, isCreating } = useCreateDeal()
  const { updateDeal, isUpdating } = useUpdateDeal()
  const { deleteDeal, isDeleting } = useDeleteDeal()

  const handleCreate = async (data: CreateDealDto) => {
    await createDeal(data)
    await mutate()
    setIsCreateDialogOpen(false)
  }

  const handleUpdate = async (data: UpdateDealDto) => {
    if (!editingDeal) return
    await updateDeal({ id: editingDeal.id, data })
    await mutate()
    setEditingDeal(null)
  }

  const openDeleteDialog = (id: string) => {
    setDeletingDealId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (deletingDealId) {
      await deleteDeal(deletingDealId)
      await mutate()
      setDeletingDealId(null)
    }
    setIsDeleteDialogOpen(false)
  }

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
    }).format(amount)

  const statusLabels: Record<DealStatus, string> = {
    [DealStatusEnum.NEW]: 'Нова',
    [DealStatusEnum.IN_PROGRESS]: 'В процесі',
    [DealStatusEnum.WON]: 'Виграна',
    [DealStatusEnum.LOST]: 'Програна',
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Угоди</h1>
          <p className="text-muted-foreground">Управління угодами</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Додати угоду
        </Button>
      </div>

      {/* Фільтри */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Фільтри</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Статус</label>
              <Select
                value={statusFilter}
                onValueChange={v => setStatusFilter(v as DealStatus | 'all')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі статуси</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Клієнт</label>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всі клієнти</SelectItem>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список угод */}
      <Card>
        <CardHeader>
          <CardTitle>Список угод</CardTitle>
          <CardDescription>
            Всього угод: {meta?.totalItems || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Завантаження...</div>
          ) : deals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Немає угод. Створіть першу угоду.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Назва</TableHead>
                  <TableHead>Клієнт</TableHead>
                  <TableHead>Сума</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Створено</TableHead>
                  <TableHead className="text-right">Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deals.map(deal => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>{deal.client.name}</TableCell>
                    <TableCell>{formatCurrency(deal.amount)}</TableCell>
                    <TableCell>{statusLabels[deal.status]}</TableCell>
                    <TableCell>{formatDate(deal.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(deal.id)}
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

      {/* Модалки */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Створити угоду</DialogTitle>
            <DialogDescription>
              Заповніть форму для створення угоди
            </DialogDescription>
          </DialogHeader>
          <DealForm
            clients={clients}
            onSubmit={
              handleCreate as (
                data: CreateDealDto | UpdateDealDto
              ) => Promise<void>
            }
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingDeal} onOpenChange={() => setEditingDeal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагувати угоду</DialogTitle>
            <DialogDescription>Внесіть зміни до угоди</DialogDescription>
          </DialogHeader>
          {editingDeal && (
            <DealForm
              clients={clients}
              deal={editingDeal}
              onSubmit={handleUpdate}
              onCancel={() => setEditingDeal(null)}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Видалити?"
        description="Ви впевнені, що хочете видалити угоду? Цю дію неможливо скасувати."
        confirmText="Видалити"
        cancelText="Скасувати"
        loading={isDeleting}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
