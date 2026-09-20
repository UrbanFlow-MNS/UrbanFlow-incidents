import { ExecutionContext } from '@nestjs/common';
import { RpcOnlyGuard } from './rpc-only.guard';

describe('RpcOnlyGuard', () => {
  const guard = new RpcOnlyGuard();
  const contextOf = (type: string) =>
    ({ getType: () => type }) as unknown as ExecutionContext;

  it('lets a message from the gateway through', () => {
    expect(guard.canActivate(contextOf('rpc'))).toBe(true);
  });

  it('refuses a direct http call', () => {
    expect(guard.canActivate(contextOf('http'))).toBe(false);
  });
});
