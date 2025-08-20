import { config } from 'dotenv';
config();

const roleValues = JSON.parse(process.env.ROLE_VALUES || '{}');

export enum Roles {
  SUPER_USER = roleValues.SUPER_USER || 1,
  USER = roleValues.USER || 2,
}
