const express = require('express');
const router = express.Router();


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = {
        productID: req.body.productID,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message: 'Orders were created',
        quantity:order
    });
});

router.get('/:orderID', (req, res, next) => {

    res.status(200).json({
        message: 'Orders details',
        orderID:req.params.orderID
    });
});

router.delete('/:orderID', (req, res, next) => {
    res.status(200).json({
        message: 'Order Deleted',
        orderID:req.params.orderID
    });
});








module.exports = router;