const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const server = express();

server.use(helmet());
server.use(morgan('dev'));
server.use(cors());

server.get('/', (req, res) => {
  res.send('Hello World!')
})

const PORT = process.env.PORT || 5555;

server.listen(PORT, () => {
  console.log(`=== You are listening to Port ${PORT} ===`)
})

module.exports = server;