import { describe, it, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { sum } from '../src/app/utils/sum';

describe('add function', () => {
  it('эерэг бүхэл тоонуудыг нэмэх', () => {
    const a = faker.number.int({ min: 1, max: 1000 });
    const b = faker.number.int({ min: 1, max: 1000 });
    expect(sum(a, b)).toBe(a + b);
  });

  it('эерэг бутархай тоонуудыг нэмэх', () => {
    const a = faker.number.float({ min: 1, max: 1000 });
    const b = faker.number.float({ min: 1, max: 1000 });
    expect(sum(a, b)).toBeCloseTo(a + b);
  });

  it('сөрөг бүхэл тоонуудыг нэмэх', () => {
    const a = faker.number.int({ min: -1000, max: -1 });
    const b = faker.number.int({ min: -1000, max: -1 });
    expect(sum(a, b)).toBe(a + b);
  });

  it('сөрөг бутархай тоонуудыг нэмэх', () => {
    const a = faker.number.float({ min: -1000, max: -1 });
    const b = faker.number.float({ min: -1000, max: -1 });
    expect(sum(a, b)).toBeCloseTo(a + b);
  });
});
