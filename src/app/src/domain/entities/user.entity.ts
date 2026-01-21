import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ name: "password_hash" })
  passwordHash!: string;

  @Column()
  role!: string; // e.g., 'admin'
}
