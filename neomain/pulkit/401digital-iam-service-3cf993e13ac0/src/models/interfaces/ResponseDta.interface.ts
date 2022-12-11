
export class ResponseDta {
  data?= new ResponseData();

  success?: boolean;

  message?: string;

  statusCode?: number;

  error?: string;
}

export class ResponseData {
  data?: any;

  meta?: unknown;
}
export class ErrorData {
  error?: string | Record<string, any>;
  timesStamp?: string;
  path?: string;

  statusCode?: number;
}
