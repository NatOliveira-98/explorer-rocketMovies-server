export enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface AppErrorTypes {
  description: string;
  httpCode: StatusCode;
  isOperational?: boolean;
}

export class AppError extends Error {
  readonly httpCode: StatusCode;
  readonly isOperational: boolean = true;

  constructor(args: AppErrorTypes) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.httpCode = args.httpCode;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}
