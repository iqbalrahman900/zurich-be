import { Test } from '@nestjs/testing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => ({
 NestFactory: {
   create: jest.fn().mockImplementation(() => Promise.resolve({
     listen: jest.fn(),
     use: jest.fn(),
     useGlobalPipes: jest.fn(),
   }))
 }
}));

jest.mock('@nestjs/swagger', () => ({
 ApiProperty: () => jest.fn(),
 ApiTags: () => jest.fn(),
 ApiOperation: () => jest.fn(),
 ApiResponse: () => jest.fn(),
 ApiQuery: () => jest.fn(),
 ApiHeader: () => jest.fn(),
 SwaggerModule: {
   createDocument: jest.fn(),
   setup: jest.fn()
 },
 DocumentBuilder: jest.fn().mockReturnValue({
   setTitle: jest.fn().mockReturnThis(),
   setDescription: jest.fn().mockReturnThis(),
   setVersion: jest.fn().mockReturnThis(),
   addTag: jest.fn().mockReturnThis(),
   addApiKey: jest.fn().mockReturnThis(),
   build: jest.fn()
 })
}));

describe('Main', () => {
 it('should bootstrap application', async () => {
   const { bootstrap } = require('./main');
   await bootstrap();
   expect(NestFactory.create).toHaveBeenCalled();
 });
});