const mongoose = require('mongoose');
/* ref here refers my order schema to the product schema , hence creating a realtion  between them */
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Product',required:true},
        quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model('Order', orderSchema);