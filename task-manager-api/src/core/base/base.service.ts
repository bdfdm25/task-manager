import { BaseEntity } from './base.entity';

export interface BaseService<T extends BaseEntity> {
  findAll?(...args: any[]): Promise<T[]>;
  findOne?(...args: any[]): Promise<T>;
  create?(...args: any[]): Promise<T | void>;
  update?(...args: any[]): Promise<T>;
  remove?(...args: any[]): Promise<void>;
}
