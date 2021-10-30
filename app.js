import express from 'express';
import chalk from 'chalk';
import Debug from 'debug';
import morgan from 'morgan';
import path from 'path';
import carsRouter from './routes/cars';
const log = Debug('mycoco:app.js');

const app = express();

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());
app.use('/cars', carsRouter);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome Home!');
});

app.get('/status', (req, res) => {
  res.json({
    call: 'status',
    status: { code: '200', temp: 'Green', desc: "Up n' Running" },
    server: 'healthy',
  });
});

app.listen(3000, () => {
  log(`Listening on port ${chalk.greenBright(PORT)}`);
});
