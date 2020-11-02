import { TenantUser } from '../interfaces';

export const getData = (): TenantUser => {
  return { id: 12345, name: 'test' };
};
