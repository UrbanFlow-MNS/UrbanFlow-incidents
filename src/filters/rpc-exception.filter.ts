import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { throwError } from 'rxjs';

interface HttpExceptionResponseBody {
  message?: string;
}

@Catch()
export class GlobalRpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType<'rpc'>() === 'rpc') {
      if (exception instanceof RpcException) {
        return throwError(() => exception.getError());
      }
      if (exception instanceof HttpException) {
        const res = exception.getResponse();
        return throwError(() => ({
          statusCode: exception.getStatus(),
          message: typeof res === 'string' ? res : (res as HttpExceptionResponseBody).message,
        }));
      }
      return throwError(() => ({
        statusCode: 500,
        message: exception instanceof Error ? exception.message : 'Internal server error',
      }));
    }

    const response = host.switchToHttp().getResponse<Response>();
    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json(exception.getResponse());
    }
    return response.status(500).json({ statusCode: 500, message: 'Internal server error' });
  }
}
