import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { $enum } from 'ts-enum-util';

import { StatusValue, DelValue } from '../../common/enums/common.enum';

@Entity('qrcode_data')
export class Qrcode {
  @ApiProperty({ type: String, description: 'id' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public id: string;

  @ApiProperty({ type: String, description: '国际区号' })
  @Column({
    type: 'varchar',
    length: 8,
    name: 'area_code',
    comment: '国际区号',
  })
  public areaCode: string;

  @ApiProperty({ type: String, description: '编码' })
  @Column({ type: 'varchar', length: 64, comment: '编码' })
  public code: string;

  @ApiProperty({ type: String, description: '客户名称' })
  @Column({ type: 'varchar', length: 64, comment: '客户名称' })
  public customer: string;

  @ApiProperty({
    type: String,
    description: '编辑标识符: 1-已编辑，0-未编辑',
    enum: $enum(StatusValue).getValues(),
  })
  @Column({
    type: 'tinyint',
    default: StatusValue.NORMAL,
    comment: '所属状态: 1-已编辑，0-未编辑',
  })
  public status: StatusValue;

  @ApiProperty({
    type: String,
    description: '删除标识符: 1-已删除，0-未删除',
    enum: $enum(DelValue).getValues(),
  })
  @Column({
    type: 'tinyint',
    default: DelValue.NORMAL,
    name: 'del_flag',
    comment: '所属状态: 1-已删除，0-未删除',
  })
  public delFlag: DelValue;

  @ApiProperty({ type: Date, description: '创建时间' })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_date',
    comment: '创建时间',
  })
  createDate: Date;

  @ApiProperty({ type: Date, description: '更新时间' })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_date',
    comment: '更新时间',
  })
  updateDate: Date;
}
