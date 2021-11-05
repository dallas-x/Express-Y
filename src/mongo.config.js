import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

export const Client = () => {
  const uri = `mongodb+srv://sheldyn:${process.env.MONGOPASSWORD}@${process.env.MONGOCLUSTER}.sbace.mongodb.net/?retryWrites=true&w=majority`;
  return new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};
export const Collection = async (client, db, col) => {
  return await client.db(db).collection(col);
};

export default { Client, Collection };
