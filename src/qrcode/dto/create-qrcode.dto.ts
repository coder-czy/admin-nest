import { ApiProperty } from '@nestjs/swagger';

export class CreateQrcodeDto {
  areaCode: string;
  code: string;
  customer: string;
  status: 0 | 1;
  delFlag: 0 | 1;
}

export class findAllDto {
  @ApiProperty({ description: '新增数量' })
  number: number;
}
