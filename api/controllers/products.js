const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_products = (req, res, next) => {
    Product.find()
        .select('name price _id productImage') /* i will only fetch these fields and no other field */
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                }),
            };
  
            res.status(200).json(response);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            });
        });
};

exports.products_create_product = (req, res, next) => {
    console.log(req.file);  /* this would be new data available to us due the upload.single()  middleware running first*/
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), /* creates a new unique ID */
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
        .then((result) => {
            console.log(result);
            /* saved it into the database. */
            res.status(201).json({
                message: "Created Product successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        }).catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.products_get_product = (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    reques: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.products_patch_product = (req, res, next) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: req.params.productID }, {
        $set: updateOps
    }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + req.params.productID
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
};

exports.products_delete_product = (req, res, next) => {
    Product.deleteOne({ _id: req.params.productID })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product Deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: {
                        name: 'String', price: 'Number'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};