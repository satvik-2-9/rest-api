const express = require("express");
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
/* app.use() sets up a middleware , an incoming request has to go through app.use */
/* morgan is used for logging the request details to console */

mongoose.connect('mongodb+srv://node-api:' + process.env.MONGO_ATLAS_PW + '@cluster0.klei1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(res => {
    console.log('connected to db');
})
    .catch(err => {
        console.log(err);
    });
    
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));  /* making uploads folder publicly available */
app.use(express.json());
app.use(express.urlencoded({extended:true}));

/* so this here handles the CORS error , giving the access 
   of the api to all possible origins = '*'
   we could a url other than the * and then the api
   will only serve data to that particular url.
*/
app.use((req, res, next) => {
    
    /* here adding all these headers to avoid the cors error .  */
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With,Content-Type, Accept, Authorization");
    
    /*
     usually the browser first sends an options request to find out the type of
       request it can send , therefore , it will get its response here.
    */
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(); 
});
 
/* so now any request with /products route , will be forwarded to products.js routeHandler */
app.use('/products', productRoutes);
/* any request with /orders route , will automatically be forwared to the orders.js file to handle */
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use((req, res, next) => {
    const error = new Error('Nah , Not found');
    error.status = 404;
    /* forwarding this request to the next routeHandler. */
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message
        }
    });
});
module.exports = app;