import { Injectable } from '@nestjs/common';
import { Repository, EntityManager, Like, Brackets } from 'typeorm';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';

import { CreateQrcodeDto } from './dto/create-qrcode.dto';
import { UpdateQrcodeDto } from './dto/update-qrcode.dto';
import { findQrcodeDto } from './dto/find-qrcode.dto';
import { Qrcode } from './entities/qrcode.entity';
import { ResultData } from '../common/utils/result';

@Injectable()
export class QrcodeService {
  constructor(
    @InjectRepository(Qrcode)
    private readonly qrcodeRepo: Repository<Qrcode>,
    @InjectEntityManager()
    private readonly qrcodeManager: EntityManager,
  ) {}

  /**
   * 新增二维码信息
   * @param createQrcodeDto 二维码信息
   */
  async create(num: number) {
    let data: CreateQrcodeDto = {
      code: '10086',
      areaCode: '+86',
      customer: '熊大',
      status: 0,
      delFlag: 0,
    };
    let addData = new Array(num).fill(data);
    this.qrcodeManager
      .createQueryBuilder()
      .insert()
      .into(Qrcode)
      .values(addData)
      .execute();
    return ResultData.ok('success');
  }

  async findAll(dto: findQrcodeDto) {
    let {
      pageSize = 10,
      pageIndex = 1,
      code = '',
      areaCode = '',
      customer = '',
      status,
      id,
    } = dto;
    let data = {};
    // id查询
    console.log(status);

    if (id) {
      data = await this.qrcodeRepo
        .createQueryBuilder('qrcode')
        .where('qrcode.del_flag = :del_flag AND qrcode.id = :id', {
          del_flag: 0,
          id,
        })
        .getOne();

      // 查询状态
    } else if (status !== undefined) {
      let list = await this.qrcodeRepo
        .createQueryBuilder('qrcode')
        .where('qrcode.del_flag = :del_flag AND qrcode.status = :status', {
          del_flag: 0,
          status,
        })
        .getManyAndCount();
      data = { data: list[0], total: list[1] };
      // 其他情况
    } else {
      let list = await this.qrcodeRepo
        .createQueryBuilder('qrcode')
        .where('qrcode.del_flag = :del_flag ', { del_flag: 0 })
        .andWhere(
          new Brackets((qb) => {
            if (code) {
              return qb.andWhere('qrcode.code LIKE :code', {
                code: `%${code}%`,
              });
            } else {
              return qb;
            }
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            if (areaCode) {
              return qb.andWhere('qrcode.area_code LIKE :areaCode', {
                areaCode: `%${areaCode}%`,
              });
            } else {
              return qb;
            }
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            if (customer) {
              return qb.andWhere('qrcode.customer LIKE :customer', {
                customer: `%${customer}%`,
              });
            } else {
              return qb;
            }
          }),
        )
        .skip((pageIndex - 1) * pageSize)
        .take(pageSize)
        .getManyAndCount();

      data = { data: list[0], total: list[1] };
    }

    return ResultData.ok(data);
  }

  update(id: string, updateQrcodeDto: UpdateQrcodeDto) {
    let { code, areaCode, customer, status, delFlag } = updateQrcodeDto;
    let updateData: UpdateQrcodeDto = {
      code,
      areaCode,
      customer,
      status,
      delFlag,
    };
    updateData.status = 1;
    let data = this.qrcodeRepo
      .createQueryBuilder('qrcode')
      .update(Qrcode)
      .set(updateData)
      .where('id = :id', { id })
      .execute();

    return ResultData.ok(data);
  }
}
