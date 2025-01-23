import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

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
      controllers: [ProductController],
      providers: [{
        provide: ProductService,
        useValue: {
          create: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
        },
      }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  describe('create', () => {
    it('should create a product', async () => {      
      jest.spyOn(service, 'create').mockResolvedValue(mockProduct);
      
      const result = await controller.create(createDto); 
      expect(result).toBe(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProduct);

      const result = await controller.findOne('1000', 'West Malaysia');
      expect(result).toBe(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith('1000', 'West Malaysia');
    });

    it('should return null if product not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      
      const result = await controller.findOne('9999', 'Unknown');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto: UpdateProductDto = { price: 350 };
      const updatedProduct = { ...mockProduct, price: 350 };
      
      jest.spyOn(service, 'update').mockResolvedValue(updatedProduct);
      
      const result = await controller.update('1000', updateDto);
      expect(result).toBe(updatedProduct);
      expect(service.update).toHaveBeenCalledWith('1000', updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      
      await controller.remove('1000');
      expect(service.remove).toHaveBeenCalledWith('1000');
    });
  });
});