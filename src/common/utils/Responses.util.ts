import { HttpStatus } from '@nestjs/common';
import { commonMessages } from '../messages/common.messages';

const response = (
  statusCode: number,
  message: string,
  data: any = null,
  error: any = null,
) => ({
  statusCode,
  message,
  data,
  error,
});

export const SuccessResponse = (
  data: any,
  message = commonMessages.SUCESS_RESPONSE,
) => response(HttpStatus.OK, message, data);

export const BadRequestResponse = (
  message = commonMessages.BAD_REQUEST,
  error: any = null,
) => response(HttpStatus.BAD_REQUEST, message, null, error);

export const InternalServerErrorResponse = (
  error: any = null,
  message = commonMessages.INTERNAL_SERVER_ERROR,
) => response(HttpStatus.INTERNAL_SERVER_ERROR, message, null, error);
