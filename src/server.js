import express from 'express';
import chalk from 'chalk';
import Debug from 'debug';
import morgan from 'morgan';
import path from 'path';
import ListingReviews from './routes/listingReviews';
import Sales from './routes/sales';
import Restaurants from './routes/restaurants';
const log = Debug('mycoco:app.js');

const app = express();

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use(express.json());
app.use('/listings', ListingReviews);
app.use('/sales', Sales);
app.use('/restaurants', Restaurants);

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

app.listen(PORT, () => {
  log(`Listening on port ${chalk.greenBright(PORT)}`);
});
