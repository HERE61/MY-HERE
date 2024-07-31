import argon2 from '@node-rs/argon2';

export const hashPassword = async (plainTextPassword: string) => {
  const passwordHash = await argon2.hash(plainTextPassword, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  return passwordHash;
};

export const verifyPassword = async (password: string, passwordHash: string) =>
  argon2.verify(passwordHash, password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
