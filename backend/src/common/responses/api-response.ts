export type ApiResponse<T> = {
  success: true;
  message: string;
  data?: T;
};

export const apiResponse = {
  success<T>(message: string, data?: T): ApiResponse<T> {
    return data === undefined
      ? { success: true, message }
      : { success: true, message, data };
  },
};
