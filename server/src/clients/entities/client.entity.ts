import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Deal } from '../../deals/entities/deal.entity';

@Entity({ name: 'clients' })
export class Client {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 320, unique: true })
  email: string;

  @ApiPropertyOptional()
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string | null;

  @ApiProperty({ type: () => [Deal] })
  @OneToMany(() => Deal, (deal) => deal.client, {
    cascade: ['remove'],
  })
  deals: Deal[];

  @ApiProperty({ type: String })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ type: String })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

