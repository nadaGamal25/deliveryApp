// export class AppError extends Error{
//     constructor(message,statusCode){
//         super(message)
//         this.statusCode = statusCode

//     }
// }

export class AppError extends Error {
    constructor(message, statusCode) {
      super(typeof message === 'string' ? message : 'Validation error');
      this.statusCode = statusCode;
      this.isOperational = true; // For handling expected errors
      this.errorDetails = typeof message === 'object' ? message : undefined;
    }
  }
  