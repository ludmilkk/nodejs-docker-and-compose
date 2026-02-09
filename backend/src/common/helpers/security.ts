import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const validatePassword = async (password: string, user: User) => {
  return (await bcrypt.compare(password, user.password)) ? user : null;
};
