import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  findOne(productCode: string, location: string): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { productCode, location },
    });
  }

  async update(productCode: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
    await this.productRepository.update(
      { productCode },
      updateProductDto,
    );
    
    return this.productRepository.findOne({
      where: { productCode },
    });
  }

  async remove(productCode: string): Promise<void> {
    await this.productRepository.delete({ productCode });
  }
}