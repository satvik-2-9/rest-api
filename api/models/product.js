const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

/* basically modelling it with mongoose allows us to perform different
   functions on the DB easily using mongoose. 
*/

module.exports = mongoose.model('Product', productSchema);