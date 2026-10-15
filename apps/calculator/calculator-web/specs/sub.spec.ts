import { describe, it, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { sub } from '../src/app/utils/sub';

describe('sub function', () => {
  it('эерэг бүхэл тоонуудыг хасах', () => {
    const a = faker.number.int({ min: 1, max: 1000 });
    const b = faker.number.int({ min: 1, max: 1000 });
    expect(sub(a, b)).toBe(a - b);
  });

  it('эерэг бутархай тоонуудыг хасах', () => {
    const a = faker.number.float({ min: 1, max: 1000 });
    const b = faker.number.float({ min: 1, max: 1000 });
    expect(sub(a, b)).toBeCloseTo(a - b);
  });

  it('сөрөг бүхэл тоонуудыг хасах', () => {
    const a = faker.number.int({ min: -1000, max: -1 });
    const b = faker.number.int({ min: -1000, max: -1 });
    expect(sub(a, b)).toBe(a - b);
  });

  it('сөрөг бутархай тоонуудыг хасах', () => {
    const a = faker.number.float({ min: -1000, max: -1 });
    const b = faker.number.float({ min: -1000, max: -1 });
    expect(sub(a, b)).toBeCloseTo(a - b);
  });
});
