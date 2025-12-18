Step 2: Start MongoDB service
Option A: Windows Service

Press Win + R, type services.msc → Enter

Find MongoDB → Right-click → Start

MongoDB is now running on port 27017

Option B: Manual

Open Command Prompt

Run:

mongod


You should see:

waiting for connections on port 27017

Step 3: Verify MongoDB

Open new terminal:

mongo


If Mongo shell opens → MongoDB is working

Type:

show dbs


You should see system databases.

Step 4: Connect Node.js to MongoDB

Install mongoose in your Node project:

npm install mongoose


In your server.js:

const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


inventoryDB → DB name (MongoDB will auto-create it)

127.0.0.1:27017 → Localhost and default port

Step 5: Run Node Server
node server.js


You should see:

MongoDB Connected


✅ Connection successful.
