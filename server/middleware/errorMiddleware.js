const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode !== 200 ? res.statusCode :
    err?.name === 'MulterError' ? 400 :
    /image|cloudinary|file/i.test(err?.message || '') ? 400 : 500;

  console.error('--- DETAILED ERROR ---');
  console.error('NAME:', err?.name || 'UnknownError');
  console.error('MESSAGE:', err?.message || 'Unknown server error');
  console.error('CODE:', err?.code ?? 'n/a');
  console.error('STACK:', process.env.NODE_ENV === 'production' ? 'hidden' : (err?.stack || 'n/a'));
  console.error('--------------------');

  res.status(statusCode).json({
    message: err?.message || 'An unexpected server error occurred.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err?.stack }),
  });
};

module.exports = { errorHandler };
