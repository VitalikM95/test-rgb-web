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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ClientForm } from '@/components/client-form'
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from '@/lib/hooks/use-clients'
import type { Client, CreateClientDto, UpdateClientDto } from '@/lib/types'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ConfirmDialog } from '@/components/confirm-dialog'

export default function ClientsPage() {
  const [page, setPage] = useState(1)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { clients, meta, isLoading, mutate } = useClients({ page, limit: 10 })
  const { createClient, isCreating } = useCreateClient()
  const { updateClient, isUpdating } = useUpdateClient()
  const { deleteClient, isDeleting } = useDeleteClient()
  const router = useRouter()

  const handleCreate = async (data: CreateClientDto) => {
    try {
      await createClient(data)
      await mutate()
      setIsCreateDialogOpen(false)
    } catch (error) {
      throw error
    }
  }

  const handleUpdate = async (data: UpdateClientDto) => {
    if (!editingClient) return
    try {
      await updateClient({ id: editingClient.id, data })
      await mutate()
      setEditingClient(null)
    } catch (error) {
      throw error
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Клієнти</h1>
          <p className="text-muted-foreground">Управління клієнтами</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Додати клієнта
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список клієнтів</CardTitle>
          <CardDescription>
            Всього клієнтів: {meta?.totalItems || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Завантаження...</div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Немає клієнтів. Створіть першого клієнта.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ім'я</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Телефон</TableHead>
                    <TableHead>Створено</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map(client => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/clients/${client.id}`}
                          className="hover:underline text-primary"
                        >
                          {client.name}
                        </Link>
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone || '-'}</TableCell>
                      <TableCell>{formatDate(client.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDeletingClientId(client.id)
                              setIsDeleteDialogOpen(true)
                            }}
                            disabled={
                              isDeleting && deletingClientId === client.id
                            }
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
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Попередня
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Сторінка {meta.currentPage} з {meta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage(p => Math.min(meta.totalPages, p + 1))
                    }
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
            <DialogTitle>Створити клієнта</DialogTitle>
            <DialogDescription>
              Заповніть форму для створення нового клієнта
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            onSubmit={
              handleCreate as (
                data: CreateClientDto | UpdateClientDto
              ) => Promise<void>
            }
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingClient}
        onOpenChange={open => !open && setEditingClient(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редагувати клієнта</DialogTitle>
            <DialogDescription>
              Внесіть зміни до інформації про клієнта
            </DialogDescription>
          </DialogHeader>
          {editingClient && (
            <ClientForm
              client={editingClient}
              onSubmit={handleUpdate}
              onCancel={() => setEditingClient(null)}
              isLoading={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Видалити клієнта?"
        description="Ви впевнені, що хочете видалити цього клієнта? Всі його угоди також будуть видалені."
        confirmText="Видалити"
        cancelText="Скасувати"
        loading={isDeleting}
        onCancel={() => setIsDeleteDialogOpen(false)}
        onConfirm={async () => {
          if (deletingClientId) {
            await deleteClient(deletingClientId)
            await mutate()
            setDeletingClientId(null)
            setIsDeleteDialogOpen(false)
          }
        }}
      />
    </div>
  )
}
