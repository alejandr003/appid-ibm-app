import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryColumn('text')
  id: string;

  @Column('text', { unique: true })
  sub: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { nullable: true })
  name: string;

  @Column('text', { nullable: true })
  avatar: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
