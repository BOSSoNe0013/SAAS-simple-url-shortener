import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Click } from './click.entity';
import { User } from './user.entity';

@Entity()
export class ShortUrl {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  code!: string;

  @Column()
  targetUrl!: string;

  @Column({ type: 'int', default: 0 })
  clicks!: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(() => Click, (click) => click.shortUrl)
  clickRecords!: Click[];

  @Column("uuid")
  ownerId: string;

  @ManyToOne(() => User, (user) => user.shortUrls)
  owner!: User;
}
