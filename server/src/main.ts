import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Clients & Deals API')
    .setDescription('CRUD API для управління клієнтами та їх угодами')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
  const allowedOrigins: (string | RegExp)[] = [
    'http://localhost:3001',
    'http://localhost:3000',
    /^http:\/\/localhost:\d+$/,
  ]

  if (process.env.FRONTEND_URL) {
    const urls = process.env.FRONTEND_URL.split(',').map(url => url.trim())
    allowedOrigins.push(...urls)
  }

  const isDevelopment = process.env.NODE_ENV !== 'production'

  app.enableCors({
    origin: isDevelopment ? true : allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
