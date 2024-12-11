const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === 'NotFound') {
    res.status(404).json({ name: 'Error Not Found', message: err.message });
  } else if (err.name === 'ValidationError') {
    res.status(400).json({ name: 'Error Bad Request', message: err.message });
  } else if (err.name === 'Conflict') {
    res.status(409).json({ name: 'Error Conflict', message: err.message });
  } else if (err.name === 'InsufficientStock') {
    res.status(400).json({ name: 'Insufficient Stock', message: err.message });
  } else if (err.name === 'MaxBorrows') {
    res.status(400).json({ name: 'Reached Max Borrows', message: err.message });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default errorHandler;
