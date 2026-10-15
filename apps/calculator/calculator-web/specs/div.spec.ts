import { describe, it, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { div } from '../src/app/utils/div';

describe('div function', () => {
  it('эерэг бүхэл тоонуудыг хуваах', () => {
    const a = faker.number.int({ min: 1, max: 1000 });
    const b = faker.number.int({ min: 1, max: 1000 });
    expect(div(a, b)).toBe(a / b);
  });

  it('эерэг бутархай тоонуудыг хуваах', () => {
    const a = faker.number.float({ min: 1, max: 1000 });
    const b = faker.number.float({ min: 1, max: 1000 });
    expect(div(a, b)).toBeCloseTo(a / b);
  });

  it('сөрөг бутархай тоонуудыг хуваах', () => {
    const a = faker.number.float({ min: -1000, max: -1 });
    const b = faker.number.float({ min: -1000, max: -1 });
    expect(div(a, b)).toBeCloseTo(a / b);
  });

  it('сөрөг бүхэл тоонуудыг хуваах', () => {
    const a = faker.number.int({ min: -1000, max: -1 });
    const b = faker.number.int({ min: -1000, max: -1 });
    expect(div(a, b)).toBe(a / b);
  });

  it('0-д хуваахад алдаа заах', () => {
    const a = faker.number.int({ min: 1, max: 1000 });
    expect(() => div(a, 0)).toThrow('0-д хувааж болохгүй');
  });
});
