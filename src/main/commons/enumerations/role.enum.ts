import { config } from 'dotenv';
config();

const roleValues = JSON.parse(process.env.ROLE_VALUES || '{}');

export enum Roles {
  ADMIN = roleValues.ADMIN || 1,
  VENDOR = roleValues.VENDOR || 2,
  USER = roleValues.USER || 3,
  CUSTOMER = roleValues.CUSTOMER || 4,
}
