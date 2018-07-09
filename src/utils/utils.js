const sanitizeMongooseError = err => {
  return err.message;
};

module.exports = {
  sanitizeMongooseError
};
