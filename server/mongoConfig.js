const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

function connectToDb() {
   return new Promise(async (resolve, reject) => {
      try {
         await client.connect();
         return resolve();
      } catch (error) {
         return reject(error);
      }
   });
}

module.exports = { connectToDb, getClient: () => client };
