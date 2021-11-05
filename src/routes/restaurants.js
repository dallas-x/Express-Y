import Debug from 'debug';
import chalk from 'chalk';
import { Client, Collection } from '../mongo.config';
import { Router } from 'express';

// Makes debugging easy && parse .env
const log = Debug('mycoco:restaurants');

const Restaurants = Router();

Restaurants.route('').get((req, res) => {
  res.json({ Whao: ':mindblown:' });
});

Restaurants.route('/top').get((req, res) => {
  (async function mongo() {
    const client = Client();
    try {
      await client.connect();

      const collection = await Collection(client, 'sample_restaurants', 'restaurants');
      log(`${chalk.yellowBright('Connection was established')}`);

      const restaurants = await collection.find({}).limit(10).toArray();
      log(`${chalk.yellowBright(`returning ${restaurants.length} items`)}`);

      res.json({ restaurants });
    } catch (error) {
      log(`${chalk.red(error)}`);
      res.json({ Error: 'Failed to connect to the database' });
    } finally {
      client.close();
    }
  })();
});

Restaurants.route('/restaurant/:id').get((req, res) => {
  (async function mongo() {
    const client = Client();
    try {
      await client.connect();

      const collection = await Collection(client, 'sample_restaurants', 'restaurants');
      log(`${chalk.yellowBright('Connection was established')}`);

      const restaurant = await collection.find({ restaurant_id: req.params.id }).toArray();
      res.json(restaurant);
    } catch (error) {
      log(`${chalk.red(error)}`);
      res.json({ Error: 'Failed to connect to the database' });
    } finally {
      client.close();
    }
  })();
});

export default Restaurants;
