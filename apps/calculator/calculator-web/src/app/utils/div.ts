export const div = (a: number, b: number): number => {
  if (b === 0) {
    const errorMsg = 'UNDEFINED';
    console.log('Хуваах үйлдэл хийхэд алдаа гарлаа :', errorMsg);
    throw new Error(errorMsg);
  }

  return a / b;
};
