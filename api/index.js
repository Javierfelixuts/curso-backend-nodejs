const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');

const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const whitelist = ['http://localhost:8080'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}
app.use(cors(options));

app.get('/api', (req, res) => {
  res.send('Hola mi server en express');
});

app.get('/api/nueva-ruta', (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


app.listen(port, () => {
  console.log('Mi port' +  port);
});









const http = require('http');

//const config = require("./app/config/config.js");
const config = {};

app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.json({ success: true, message: "Server node js" });
});


app.post("/lessons", (req, res) => {
    console.log('update');
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    config.SOKECT_IO.emit('updateLesson', req.body);
    res.json(req.body);
});


var server = http.createServer(app);
var io = require('socket.io')(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: '*',
    }
});
config.SOKECT_IO = io;

server.listen(app.get('port'), () => {
    console.log('Running server');
});

io.on('connect', async(socket) => {
    console.log('Connected socket');
});