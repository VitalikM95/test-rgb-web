import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

export enum DealStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  WON = 'WON',
  LOST = 'LOST',
}

@Entity({ name: 'deals' })
export class Deal {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty()
  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  amount: number;

  @ApiProperty({ enum: DealStatus, default: DealStatus.NEW })
  @Column({
    type: 'enum',
    enum: DealStatus,
    default: DealStatus.NEW,
  })
  status: DealStatus;

  @ApiProperty({ type: () => Client })
  @ManyToOne(() => Client, (client) => client.deals, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  client: Client;

  @ApiProperty({ type: String })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
