const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./db/connectDB');
const teacher = require('./Controllers/teacher');


app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
});

app.use('/',teacher)
