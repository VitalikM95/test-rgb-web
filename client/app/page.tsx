import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Handshake } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Система управління клієнтами та угодами
        </h1>
        <p className="text-muted-foreground text-lg mb-12 text-center max-w-2xl">
          Повнофункціональний CRUD-додаток для управління клієнтами та їх угодами
        </p>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl w-full">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Клієнти</CardTitle>
              </div>
              <CardDescription>
                Управління клієнтами: створення, перегляд, редагування та видалення
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/clients">
                <Button className="w-full">Перейти до клієнтів</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Handshake className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Угоди</CardTitle>
              </div>
              <CardDescription>
                Управління угодами з фільтрацією за статусом та клієнтом
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/deals">
                <Button className="w-full">Перейти до угод</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Використано технології: Next.js, shadcn/ui, SWR, TypeScript, Zod</p>
        </div>
      </div>
    </div>
  );
}
