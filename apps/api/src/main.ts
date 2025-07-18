import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { routers } from './routers';

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

routers.forEach(({ path, router }) => {
  app.use(path, router);
});

app.listen(port, () => {
  console.log(`API: http://localhost:${port}`);
});
