import express from 'express';
import productRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import chatRouter from './routes/chatRouter.js';
import upload from './config/multer.js';
import { __dirname } from './path.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

//Config
const app = express();
const PORT = 3000;

//Server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
const io = new Server(server);

//Middlewares
app.use(express.json());
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

//Chat
const msgs = [];
//Socket io
io.on('connection', (socket) => {
    console.log('El socket se ha conectado con el id: ' + socket.id);

    socket.on('message', info => {
        console.log(info);
        msgs.push(info);
        socket.emit('messageLogs', msgs);
    });
});

//Routes
app.use('/public', express.static(__dirname + '/public'));
app.use('/api/products', productRouter, express.static(__dirname + '/public'));
app.use('/api/chat', chatRouter, express.static(__dirname + '/public'));
app.use('/api/cart', cartRouter);
app.post('/upload', upload.single('product'), (req, res) => {
    try {
        console.log(req.file);
        console.log(req.body);
        res.status(200).send('Imagen subida con exito');
    } catch (error) {
        res.status(500).send('Error interno del servidor al subir la imagen');
    }
});