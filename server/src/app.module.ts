import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientsModule } from './clients/clients.module'
import { DealsModule } from './deals/deals.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const synchronize = configService.get<string>('DATABASE_SYNCHRONIZE')
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST', 'localhost'),
          port: Number(configService.get<string>('DATABASE_PORT', '5432')),
          username: configService.get<string>('DATABASE_USER', 'postgres'),
          password: configService.get<string>('DATABASE_PASSWORD', 'postgres'),
          database: configService.get<string>('DATABASE_NAME', 'app'),
          autoLoadEntities: true,
          synchronize:
            synchronize !== undefined
              ? synchronize.toLowerCase() === 'true'
              : false,
        }
      },
    }),
    ClientsModule,
    DealsModule,
  ],
})
export class AppModule {}
