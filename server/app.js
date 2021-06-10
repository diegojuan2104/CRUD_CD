
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());


app.use(require('./routes/data'));


app.listen(4000);
console.log('Server on port 4000');