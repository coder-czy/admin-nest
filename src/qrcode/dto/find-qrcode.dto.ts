import { ApiProperty } from '@nestjs/swagger';

export class findQrcodeDto {
  @ApiProperty({ description: 'id' })
  id?: string;

  @ApiProperty({ description: '编码查询' })
  code?: string;

  @ApiProperty({ description: '国际区号' })
  areaCode?: string;

  @ApiProperty({ description: '客户名称' })
  customer?: string;

  @ApiProperty({ description: '编辑状态' })
  status?: 0 | 1;

  @ApiProperty({ description: '页码' })
  pageIndex?: number;

  @ApiProperty({ description: '页数' })
  pageSize?: number;
}
