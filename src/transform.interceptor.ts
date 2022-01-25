import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
  statusCode: number;
  message?: string;
  data?: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        if (
          statusCode === HttpStatus.OK ||
          statusCode === HttpStatus.CREATED ||
          statusCode === HttpStatus.ACCEPTED
        ) {
          return {
            statusCode: statusCode,
            data: data,
          };
        } else {
          return {
            statusCode: statusCode,
            message: data,
          };
        }
      }),
    );
  }
}
