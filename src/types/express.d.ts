declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        login: string;
        sub: string;
      };
    }
  }
}

export {};
