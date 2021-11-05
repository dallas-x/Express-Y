import Debug from 'debug';
import chalk from 'chalk';
import { Client, Collection } from '../mongo.config';
import { Router } from 'express';

// Makes debugging easy && parse .env
const log = Debug('mycoco:listings');

const ListingReviews = Router();

ListingReviews.route('').get((req, res) => {
  res.json({ Whoa: 'Thats too much data!' });
});

ListingReviews.route('/top').get((req, res) => {
  (async function mongo() {
    const client = Client();
    try {
      await client.connect();

      const collection = await Collection(client, 'sample_airbnb', 'listingsAndReviews');
      log(`${chalk.yellowBright('Connection was established')}`);

      const listings = await collection.find({}).limit(10).toArray();
      log(`${chalk.yellowBright(`returning ${listings.length} items`)}`);

      res.json({ listings });
    } catch (error) {
      log(`${chalk.red(error)}`);
      res.json({ Error: 'Failed to connect to the database' });
    } finally {
      client.close();
    }
  })();
});

// Testing http://localhost:4000/listings/reviews/10057447
ListingReviews.route('/reviews/:id').get((req, res) => {
  (async function mongo() {
    const client = Client();
    try {
      await client.connect();

      const collection = await Collection(client, 'sample_airbnb', 'listingsAndReviews');
      log(`${chalk.yellowBright('Connection was established')}`);

      const listings = await collection.find({ _id: req.params.id }).toArray();
      res.json(listings);
    } catch (error) {
      log(`${chalk.red(error)}`);
      res.json({ Error: 'Failed to connect to the database' });
    } finally {
      client.close();
    }
  })();
});

export default ListingReviews;
