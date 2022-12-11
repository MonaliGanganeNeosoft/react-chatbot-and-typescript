export const successResponse = (statusCode: number = 0) => {
  return statusCode && statusCode >= 200 && statusCode < 400;
};
