import * as nanoid from 'nanoid';

export const generateCode = async () => {
  const generator = nanoid.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);
  return generator();
};
