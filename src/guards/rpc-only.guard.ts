import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class RpcOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return context.getType() === 'rpc';
  }
}
