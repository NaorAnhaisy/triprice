import { User } from '../../../shared/models/users/user';

export interface TokenSet {
  accessToken: string;
  connectedUser: User;
}
