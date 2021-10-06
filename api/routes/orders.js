const { response } = require('express');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const order = require('../models/order');

const Order = require('../models/order');
const product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product','name') /* basically to get all the information of the referenced DB */
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url:'http://localhost:3000/orders/'+doc._id
                        }
                    }
                })
        });
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res, next) => {
    /* we wanna make sure that i onlt add orders for products that i have */
    product.findById(req.body.productID)
        .then(product => {
            if (!product) {
                return res.status(500).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productID
            });
            return order.save();
        })
        .then(response => {
            /* response would be the newly created object */
            console.log(response);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: response._id,
                    product: response.product,
                    quantity: response.quantity,
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + response._id
                }
            });
        })
        .catch(e => {
            res.status(500).json({
                message: 'Product not found',
                error: e
            });
        });
});

router.get('/:orderID', (req, res, next) => {
     
    Order.findById(req.params.orderID)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/'+req.params.orderID
                }
            })
        })
        .catch((e) => {
            res.status(500).json({
                error: e
            })
        });
});

router.delete('/:orderID', (req, res, next) => {
    Order.findByIdAndDelete({ _id: req.params.orderID })
        .exec()
        .then(order => {
            res.status(200).json({
                message:'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders/' + req.params.orderID,
                    body: { productID: 'ID', quantity: 'Number' }
                }
            })
        })
        .catch((e) => {
            res.status(500).json({
                error: e
            })
        });
    
});








module.exports = router;