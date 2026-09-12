export enum security_event_type {
  USER_CREATED = 'USER_CREATED',
  LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
}

export class PrismaClient {
  constructor(...args: unknown[]) {
    void args;
  }

  $disconnect(): Promise<void> {
    return Promise.resolve();
  }
}
