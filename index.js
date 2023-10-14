const connectMoongose = require('./db');
const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000;

app.use(cors());
// to get content in json format 
app.use(express.json());

// connect To Data Base
connectMoongose();
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`)
})