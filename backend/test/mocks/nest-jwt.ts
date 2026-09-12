export class JwtService {
  signAsync(): Promise<string> {
    return Promise.resolve('');
  }

  verifyAsync<T>(): Promise<T> {
    return Promise.reject(
      new Error('JwtService test double must be configured in the test.'),
    );
  }
}

export class JwtModule {
  static register(): {
    module: typeof JwtModule;
    providers: [typeof JwtService];
    exports: [typeof JwtService];
  } {
    return {
      module: JwtModule,
      providers: [JwtService],
      exports: [JwtService],
    };
  }
}
