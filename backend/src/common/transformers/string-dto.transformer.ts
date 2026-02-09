import { TransformFnParams } from 'class-transformer';

export const emptyToUndefined = ({ value }: TransformFnParams) => {
  if (typeof value !== 'string') return value;
  const cleaned = value.trim();
  return cleaned === '' ? undefined : cleaned;
};
