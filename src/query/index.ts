import { TenantUser } from '../interfaces';

// get query, mocked data
export const getData = (): TenantUser => {
  return { id: 12345, name: 'test' };
};
