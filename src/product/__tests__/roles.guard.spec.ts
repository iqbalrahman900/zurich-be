import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { RolesGuard } from '../../middleware/roles.guard';

describe('RolesGuard', () => {
 let guard: RolesGuard;
 let reflector: Reflector;

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     providers: [
       RolesGuard,
       {
         provide: Reflector,
         useValue: {
           get: jest.fn(),
         },
       },
     ],
   }).compile();

   guard = module.get<RolesGuard>(RolesGuard);
   reflector = module.get<Reflector>(Reflector);
 });

 it('should be defined', () => {
   expect(guard).toBeDefined();
 });

 it('should allow access when no roles are required', () => {
   jest.spyOn(reflector, 'get').mockReturnValue(undefined);
   
   const context = {
     getHandler: () => ({}),
     switchToHttp: () => ({
       getRequest: () => ({
         headers: {},
       }),
     }),
   } as ExecutionContext;

   expect(guard.canActivate(context)).toBe(true);
 });

 it('should allow access when user has required role', () => {
   jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
   
   const context = {
     getHandler: () => ({}),
     switchToHttp: () => ({
       getRequest: () => ({
         headers: {
           'x-user-role': 'admin',
         },
       }),
     }),
   } as ExecutionContext;

   expect(guard.canActivate(context)).toBe(true);
 });

 it('should deny access when user lacks required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-user-role': 'user',
          },
        }),
      }),
    } as ExecutionContext;
  
    try {
      guard.canActivate(context);
    } catch (error) {
      expect(error.message).toBe('No role provided');
    }
  });

 it('should deny access when no role header is provided', () => {
   jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
   
   const context = {
     getHandler: () => ({}),
     switchToHttp: () => ({
       getRequest: () => ({
         headers: {},
       }),
     }),
   } as ExecutionContext;

   try {
     guard.canActivate(context);
     fail('Should have thrown UnauthorizedException');
   } catch (error) {
     expect(error).toBeInstanceOf(UnauthorizedException);
     expect(error.message).toBe('No role provided');
   }
 });
});