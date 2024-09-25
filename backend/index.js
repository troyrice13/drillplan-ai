const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');
const profileRoutes = require('./routes/profile');
const routineRoutes = require('./routes/routines');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || "mongodb+srv://troyrice13:N2mkY25P6NxAlMmG@drillplan.7pbjz.mongodb.net/?retryWrites=true&w=majority&appName=DrillPlan";

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

    const database = client.db("DrillPlan"); // Make sure this matches your database name

    app.use('/api/auth', authRoutes(database));
    // Uncomment and update these as you update each route file
    // app.use('/api/protected', protectedRoutes(database));
    // app.use('/api/profile', profileRoutes(database));
    // app.use('/api/routines', routineRoutes(database));

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

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
}

startServer().catch(console.dir);