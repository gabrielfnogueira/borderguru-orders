const sanitizeMongooseError = err => {
  const error = Object.assign({}, err);
  delete error.errors;
  delete error._message;

  return error;
};

module.exports = {
  sanitizeMongooseError
};
