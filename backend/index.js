const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db("DrillPlan");

    const authRoutes = require('./routes/auth');
    const profileRoutes = require('./routes/profile');
    const routineRoutes = require('./routes/routines');

    app.use('/api/auth', authRoutes(database));
    app.use('/api/profile', profileRoutes(database));
    app.use('/api/routines', routineRoutes(database));

    app.get('/', (req, res) => {
      res.send('Hello, this is the backend server!');
    });

    app.get('/api/test-db', async (req, res) => {
      try {
        await client.db("admin").command({ ping: 1 });
        res.json({ message: "Database connection successful!" });
      } catch (error) {
        console.error("Error testing database connection:", error);
        res.status(500).json({ message: "Database connection failed", error: error.message });
      }
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
}

startServer().catch(console.dir);

process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown', error);
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});