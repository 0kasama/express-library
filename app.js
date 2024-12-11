import express from 'express';
import router from './src/routes/index.js';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(express.json());
app.use(router);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
