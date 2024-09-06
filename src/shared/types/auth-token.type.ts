export type AuthToken = {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  iat: number;
  exp: number;
};
