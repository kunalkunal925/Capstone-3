require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

const requiredEnvironment = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);

if (missingEnvironment.length) {
  throw new Error(`Missing required environment variables: ${missingEnvironment.join(', ')}`);
}

const startServer = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`NeevCraft API listening on port ${port}`));
};

startServer().catch((error) => {
  console.error(`Unable to start NeevCraft API: ${error.message}`);
  process.exitCode = 1;
});