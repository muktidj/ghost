import bcrypt from 'bcrypt';

export const encrypt = (data: string) => {
  const saltRounds = 10;
  return bcrypt.hashSync(data, saltRounds);
};

export const compareEncrypt = (data: string, hash: string) => {
  const replaceHash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
  return bcrypt.compareSync(data, replaceHash);
};
