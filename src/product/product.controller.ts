import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../middleware/roles.guard';

@ApiTags('products')
@Controller('product')
@UseGuards(RolesGuard)
@ApiHeader({
  name: 'x-user-role',
  description: 'User role (admin required for POST/PUT/DELETE)',
  required: false,
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create product price' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get product price' })
  @ApiQuery({ name: 'productCode', required: true })
  @ApiQuery({ name: 'location', required: true })
  findOne(@Query('productCode') productCode: string, @Query('location') location: string) {
    return this.productService.findOne(productCode, location);
  }

  @Put()
  @Roles('admin')
  @ApiOperation({ summary: 'Update product price' })
  @ApiQuery({ name: 'productCode', required: true })
  update(@Query('productCode') productCode: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(productCode, updateProductDto);
  }

  @Delete()
  @Roles('admin')
  @ApiOperation({ summary: 'Delete product' })
  @ApiQuery({ name: 'productCode', required: true })
  remove(@Query('productCode') productCode: string) {
    return this.productService.remove(productCode);
  }
}