'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DealForm } from '@/components/deal-form';
import {
  useDeals,
  useCreateDeal,
  useUpdateDeal,
  useDeleteDeal,
} from '@/lib/hooks/use-deals';
import { useClients } from '@/lib/hooks/use-clients';
import type { Deal, CreateDealDto, UpdateDealDto, DealStatus } from '@/lib/types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { DealStatus as DealStatusEnum } from '@/lib/types';

export default function DealsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<DealStatus | 'all'>('all');
  const [clientFilter, setClientFilter] = useState<string | 'all'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null);

  const { deals, meta, isLoading, mutate } = useDeals({
    page,
    limit: 10,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    clientId: clientFilter !== 'all' ? clientFilter : undefined,
  });

  const { clients } = useClients({ page: 1, limit: 1000 }); // Отримуємо всіх клієнтів для фільтрів
  const { createDeal, isCreating } = useCreateDeal();
  const { updateDeal, isUpdating } = useUpdateDeal();
  const { deleteDeal, isDeleting } = useDeleteDeal();

  const handleCreate = async (data: CreateDealDto) => {
    await createDeal(data);
    await mutate();
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async (data: UpdateDealDto) => {
    if (!editingDeal) return;
    await updateDeal({ id: editingDeal.id, data });
    await mutate();
    setEditingDeal(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цю угоду?')) {
      await deleteDeal(id);
      await mutate();
      setDeletingDealId(null);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
    }).format(amount);
  };

  const statusLabels: Record<DealStatus, string> = {
    [DealStatusEnum.NEW]: 'Нова',
    [DealStatusEnum.IN_PROGRESS]: 'В процесі',
    [DealStatusEnum.WON]: 'Виграна',
    [DealStatusEnum.LOST]: 'Програна',
  };

  const statusColors: Record<DealStatus, string> = {
    [DealStatusEnum.NEW]: 'bg-blue-100 text-blue-800',
    [DealStatusEnum.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
    [DealStatusEnum.WON]: 'bg-green-100 text-green-800',
    [DealStatusEnum.LOST]: 'bg-red-100 text-red-800',
  };

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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Фільтри</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Статус</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DealStatus | 'all')}>
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
                  {clients.map((client) => (
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
            <>
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
                  {deals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-medium">{deal.title}</TableCell>
                      <TableCell>
                        <Link
                          href={`/clients/${deal.client.id}`}
                          className="hover:underline text-primary"
                        >
                          {deal.client.name}
                        </Link>
                      </TableCell>
                      <TableCell>{formatCurrency(deal.amount)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[deal.status]}`}
                        >
                          {statusLabels[deal.status]}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(deal.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingDeal(deal)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(deal.id)}
                            disabled={isDeleting && deletingDealId === deal.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Попередня
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Сторінка {meta.currentPage} з {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                  >
                    Наступна
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Створити угоду</DialogTitle>
            <DialogDescription>
              Заповніть форму для створення нової угоди
            </DialogDescription>
          </DialogHeader>
          <DealForm
            clients={clients}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingDeal} onOpenChange={(open) => !open && setEditingDeal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагувати угоду</DialogTitle>
            <DialogDescription>
              Внесіть зміни до інформації про угоду
            </DialogDescription>
          </DialogHeader>
          {editingDeal && (
            <DealForm
              deal={editingDeal}
              clients={clients}
              onSubmit={handleUpdate}
              onCancel={() => setEditingDeal(null)}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

