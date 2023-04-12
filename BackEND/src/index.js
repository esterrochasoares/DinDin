const express = require('express');
const { router } = require('./routes/route');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

console.log('running');

app.listen(8000);