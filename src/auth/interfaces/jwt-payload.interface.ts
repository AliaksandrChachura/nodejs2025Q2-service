export interface JwtPayload {
  userId: string;
  login: string;
  sub: string;
  iat?: number;
  exp?: number;
}
