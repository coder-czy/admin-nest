import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { QrcodeService } from './qrcode.service';
import { CreateQrcodeDto, findAllDto } from './dto/create-qrcode.dto';
import { UpdateQrcodeDto } from './dto/update-qrcode.dto';

@Controller('qrcode')
export class QrcodeController {
  constructor(private readonly qrcodeService: QrcodeService) {}

  @Post()
  create(@Body() dto: findAllDto) {
    return this.qrcodeService.create(dto.number);
  }

  @Get()
  findAll(
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
    @Query('code') code: string,
    @Query('areaCode') areaCode: string,
    @Query('customer') customer: string,
    @Query('id') id: string,
    @Query('status') status: 0 | 1,
  ) {
    return this.qrcodeService.findAll({
      pageIndex,
      pageSize,
      code,
      areaCode,
      customer,
      id,
      status,
    });
  }
  @Get('/one')
  findOne(@Query('id') id: string) {
    return this.qrcodeService.findAll({
      id,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQrcodeDto: UpdateQrcodeDto) {
    return this.qrcodeService.update(id, updateQrcodeDto);
  }
}
