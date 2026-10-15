import { describe, it, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { mul } from '../src/app/utils/mul';

describe('mul function', () => {
  it('эерэг бүхэл тоонуудыг үржих', () => {
    const a = faker.number.int({ min: 1, max: 100 });
    const b = faker.number.int({ min: 1, max: 100 });
    expect(mul(a, b)).toBe(a * b);
  });

  it('эерэг бутархай тоонуудыг үржих', () => {
    const a = faker.number.float({ min: 1, max: 100 });
    const b = faker.number.float({ min: 1, max: 100 });
    expect(mul(a, b)).toBeCloseTo(a * b);
  });

  it('сөрөг бүхэл тоонуудыг үржих', () => {
    const a = faker.number.int({ min: -100, max: -1 });
    const b = faker.number.int({ min: -100, max: -1 });
    expect(mul(a, b)).toBe(a * b);
  });

  it('сөрөг бутархай тоонуудыг үржих', () => {
    const a = faker.number.float({ min: -100, max: -1 });
    const b = faker.number.float({ min: -100, max: -1 });
    expect(mul(a, b)).toBeCloseTo(a * b);
  });

  it('0-ээр үржихэд 0 гарах', () => {
    const a = faker.number.float({ min: -1000, max: 1000 });
    expect(mul(a, 0)).toEqual(0);
  });
});
