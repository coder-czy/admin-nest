import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ type: String, description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: string;

  @ApiProperty({ type: String, description: '用户登录账号' })
  @Column({ type: 'varchar', length: 32, comment: '用户登录账号' })
  public username: string;

  //普通列
  @ApiProperty({ type: String, description: '密码' })
  @Column({ type: 'varchar', length: 200, comment: '密码' })
  password: string;
}
