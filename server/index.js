
const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config({ path: "variables.env" });

app.use(express.json());
app.use(cors());


app.use(require('./routes/data'));
app.use(require('./routes/users'));
app.use(require('./routes/authentication'));


app.listen(process.env.PORT || 4000);
console.log('Server on port 4000');