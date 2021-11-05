import Debug from 'debug';
import chalk from 'chalk';
import { Client, Collection } from '../mongo.config';
import { ObjectId } from 'mongodb';
import { Router } from 'express';

// Makes debugging easy && parse .env
const log = Debug('mycoco:restaurants');

const Sales = Router();

Sales.route('').get((req, res) => {
  res.json({ McDonalds: 'Billions and Billions served' });
});

Sales.route('/top').get((req, res) => {
  (async function mongo() {
    const client = Client();
    try {
      await client.connect();

      const collection = await Collection(client, 'sample_supplies', 'sales');
      log(`${chalk.yellowBright('Connection was established')}`);

      const sales = await collection.find({}).limit(10).toArray();
      log(`${chalk.yellowBright(`returning ${sales.length} items`)}`);

      res.json({ sales });
    } catch (error) {
      log(`${chalk.red(error)}`);
      res.json({ Error: 'Failed to connect to the database' });
    } finally {
      client.close();
    }
  })();
});

// http://localhost:4000/sales/transaction/5bd761dcae323e45a93ccff1
Sales.route('/transaction/locate/:id').get((req, res) => {
  (async function mongo() {
    const client = Client();
    try {
      await client.connect();

      const collection = await Collection(client, 'sample_supplies', 'sales');
      log(`${chalk.yellowBright('Connection was established')}`);
      const tid = ObjectId(req.params.id);
      const transaction = await collection.find({ _id: tid }).toArray();
      log(`${chalk.yellowBright(`returning ${transaction.length} items`)}`);

      res.json(transaction);
    } catch (error) {
      log(`${chalk.red(error)}`);
      res.json({ Error: 'Failed to connect to the database' });
    } finally {
      client.close();
    }
  })();
});

// http://localhost:4000/sales/transaction/list/Denver&In%20store
Sales.route('/transaction/list/:store&:purchaseMethod').get((req, res) => {
  (async function mongo() {
    const client = Client();
    try {
      await client.connect();

      const collection = await Collection(client, 'sample_supplies', 'sales');
      log(`${chalk.yellowBright('Connection was established')}`);
      const transaction = await collection
        .find({
          storeLocation: req.params.store,
          purchaseMethod: req.params.purchaseMethod,
        })
        .limit(25)
        .toArray();
      log(`${chalk.yellowBright(`returning ${transaction.length} items`)}`);

      res.json(transaction);
    } catch (error) {
      log(`${chalk.red(error)}`);
      res.json({ Error: 'Failed to connect to the database' });
    } finally {
      client.close();
    }
  })();
});

// http://localhost:4000/sales/transaction/find/?store=Denver&purchase=In%20store&date=2014-08-18
Sales.route('/transaction/find/').get((req, res) => {
  console.log(req.query);
  (async function mongo() {
    const client = Client();
    try {
      await client.connect();

      const collection = await Collection(client, 'sample_supplies', 'sales');
      log(`${chalk.yellowBright('Connection was established')}`);
      const transaction = await collection
        .aggregate([
          {
            $project: {
              ymd: { $dateToString: { format: '%Y-%m-%d', date: '$saleDate' } },
              storeLocation: 1,
              purchaseMethod: 1,
              customer: 1,
              items: 1,
            },
          },
          {
            $match: {
              ymd: req.query.date,
              purchaseMethod: req.query.purchase,
              storeLocation: req.query.store,
            },
          },
          {
            $project: {
              date: 1,
              storeLocation: 1,
              purchaseMethod: 1,
              customer: 1,
              items: 1,
            },
          },
        ])
        .toArray();
      log(`${chalk.yellowBright(`returning ${transaction.length} items`)}`);

      res.json(transaction);
    } catch (error) {
      log(`${chalk.red(error)}`);
      res.json({ Error: 'Failed to connect to the database' });
    } finally {
      client.close();
    }
  })();
});

export default Sales;
