import express from 'express';
import router from './src/routes/index.js';
import morgan from 'morgan';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(express.json());
app.use(router);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
