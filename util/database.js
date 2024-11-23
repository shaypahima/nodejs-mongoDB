import { MongoClient } from "mongodb";

let _db;

const client = new MongoClient(process.env.DATABASE_URI)

export const mongoConnect = async (callback) => {
  try {
    
    await client.connect()
    _db = await client.db()
    callback()

  } catch (error) {
    console.log(error);
  }
}

export const getDb = () => {
  if (_db) {
    return _db
  }
  throw 'no database found!'
}

export const getProductCollection = () => {
  if (_db) {
    return _db.collection('products')
  }
  throw 'no Product Collection found!'
}

export const getUserCollection = () => {
  if (_db) {

    return _db.collection('users')
  }
  throw 'no User Collection found!'

}