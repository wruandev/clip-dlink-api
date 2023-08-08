export {};
export interface RequestUser {
  id: string;
  username: string;
}
declare global {
  namespace Express {
    export interface Request {
      user?: RequestUser;
    }
  }
}
