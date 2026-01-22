import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ShortUrl } from './short-url.entity';

@Entity()
export class Click {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  shortUrlId!: string;

  @ManyToOne(() => ShortUrl, (url) => url.clickRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shortUrlId' })
  shortUrl!: ShortUrl;

  @Column()
  ipAddress!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp!: Date;
}
