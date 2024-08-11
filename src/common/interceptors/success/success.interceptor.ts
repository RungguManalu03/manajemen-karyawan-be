import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data)=> {
        if (data && data.meta && data.data) {
          return data;
        };

        const status = context.switchToHttp().getResponse().statusCode;
        let message = "Success";
        
        if (status === 201) {
          message = "Created";
        };

        return {
          meta: {
            message : message,
            status: status.toString(),
          },
          data: Array.isArray(data) ? data : [data],
        };
      }),
    );
  }
}
