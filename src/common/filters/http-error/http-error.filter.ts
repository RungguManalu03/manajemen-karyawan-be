import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpErrorFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx =   host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();

    const errorResponse = {
      errors: [
        {
          status: status.toString(),
          message: typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message,
        },
      ],
    };
     response.status(status).json(errorResponse);
     return;
  }
}
