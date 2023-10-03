const express = require('express');
const cors = require('cors');
const connection = require('./database/config');
const routerApi = require('./routes');
const { join } = require('node:path');
const http = require('http');
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const whitelist = ['*'];
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




app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.post('/notifications', (req, res) => {
  console.log("req: ", req.body)
  io.emit('notification', {
    notification: req.body
  })
  res.status(200).json({ message: "Solicitud procesada con éxito" });
});


var server = http.createServer(app);
var io = require('socket.io')(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: '*',
    }
});



io.on('connect', async(socket) => {
  connection.query('SELECT * FROM notifications', function(err, rows, fields) {
    if (err) throw err;

    socket.emit('init', {
      message: rows
    })

  });

    
    

    socket.on('chat:message', (data) => {
      io.emit('chat:message', data)
    })
});


server.listen(port, () => {
  console.log('Running server');
});