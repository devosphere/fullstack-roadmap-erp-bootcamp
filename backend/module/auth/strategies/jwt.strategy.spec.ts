import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  const jwtService = {
    verifyAsync: jest.fn(),
  } as unknown as JwtService;
  const strategy = new JwtStrategy(jwtService);

  beforeEach(() => jest.clearAllMocks());

  it('returns a verified payload with a subject and email', async () => {
    const payload = {
      sub: 'user-1',
      email: 'jane@example.com',
      exp: 123456789,
    };
    jest.mocked(jwtService.verifyAsync).mockResolvedValue(payload);

    await expect(strategy.authenticate('valid-token')).resolves.toEqual(
      payload,
    );
  });

  it('rejects malformed or expired tokens when JWT verification fails', async () => {
    jest
      .mocked(jwtService.verifyAsync)
      .mockRejectedValue(new Error('jwt expired'));

    await expect(strategy.authenticate('expired-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
