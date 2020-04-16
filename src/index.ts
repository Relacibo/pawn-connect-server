import './loadEnv'; // Must be the first import
import morgan from 'morgan';
import helmet from 'helmet';
const { ExpressPeerServer } = require('peer');

import express, { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import DefaultRouter from './templating'
import path from 'path';
import qs from 'qs';
import config from './config';

// Init express
const app = express();



/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message, err);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});


// Start the server
const port = Number(process.env.PORT || config.port);
let server = app.listen(port, () => {
    console.log('Express server started on port: ' + port);
});

/************************************************************************************
 *                                    Peer-Server
 ***********************************************************************************/
const peerServer = ExpressPeerServer(server, {
    debug: true,
    path: '/myapp'
  });
app.use('/peerjs', peerServer);
console.log('Peer server started');

/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/
app.get('/favicon.ico', (req, res) => res.sendStatus(404));

let viewsDir = path.join(__dirname, 'views');
app.set('json escape', true);
app.set('views', viewsDir);
app.set('view engine', 'pug');
app.use('*', DefaultRouter);
