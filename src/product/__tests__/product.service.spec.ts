import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product.service';
import { Product } from '../entities/product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  const createDto = {
    productCode: '1000',
    productDescription: 'Sedan',
    location: 'West Malaysia',
    price: 300
  };

  const mockProduct = {
    id: 1,
    productCode: '1000',
    productDescription: 'Sedan',
    location: 'West Malaysia', 
    price: 300
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn().mockReturnValue(mockProduct),
            save: jest.fn().mockResolvedValue(mockProduct),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  describe('create', () => {
    it('should create a product', async () => {
      const result = await service.create(createDto);
      expect(result).toEqual(mockProduct);
      expect(repo.create).toHaveBeenCalledWith(createDto);
      expect(repo.save).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('findOne', () => {
    it('should find a product', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockProduct);

      const result = await service.findOne('1000', 'West Malaysia');
      expect(result).toEqual(mockProduct);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { productCode: '1000', location: 'West Malaysia' },
      });
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto = { price: 350, productDescription: 'Sedan Updated' };
      const updatedProduct = { ...mockProduct, ...updateDto };

      jest.spyOn(repo, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(repo, 'findOne').mockResolvedValue(updatedProduct);

      const result = await service.update('1000', updateDto);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);
      
      await service.remove('1000');
      expect(repo.delete).toHaveBeenCalledWith({ productCode: '1000' });
    });
  });
});