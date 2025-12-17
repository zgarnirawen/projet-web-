export interface IUser {
  _id?: string;
  email: string;
  name: string;
  password?: string; // Optional pour les comptes Google
  provider: 'local' | 'google';
  googleId?: string;
  role: 'ADMIN' | 'USER';
  createdAt: Date;
  updatedAt: Date;
}

export const USER_COLLECTION = "user";
