import * as dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';


async function main() {
    console.log('Connected to database!');
    await mongoose.connect(process.env.DB_URL);
    

    // await clearDatabase();
    // console.log();

    // Disconnect when complete
    await mongoose.disconnect();
    console.log('Disconnected from database!');
}
main();
/**
 * Deletes all data in all collections, using a schema-agnostic approach.
 */
async function clearDatabase() {
    console.log("Clearing entire database...");
    const collections = await mongoose.connection.db.collections();
    for (const c of collections) {
      await c.deleteMany({});
    }
    console.log("cleared database");
  }
