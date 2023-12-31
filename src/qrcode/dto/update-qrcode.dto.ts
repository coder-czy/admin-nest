import { ApiProperty } from '@nestjs/swagger';

export class UpdateQrcodeDto {
  @ApiProperty({ description: '编码查询' })
  code?: string;

  @ApiProperty({ description: '国际区号' })
  areaCode?: string;

  @ApiProperty({ description: '客户名称' })
  customer?: string;

  @ApiProperty({ description: '编辑状态' })
  status?: 0 | 1;

  @ApiProperty({ description: '删除状态' })
  delFlag?: 0 | 1;

  @ApiProperty({ description: '删除状态' })
  updateDate?: string;
}
