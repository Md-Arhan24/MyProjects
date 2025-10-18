class ExpressError extends Error {
  constructor(statusCode,message ) {
    super();
    console.log("express error called");
    console.log(statusCode,message);
    this.statusCode = statusCode;
    this.message = message;
    // Error.captureStackTrace(this, this, this.constructor);
  } 
}
module.exports = ExpressError;