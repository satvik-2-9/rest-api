const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
/* this router will handle all incoming get requests
   at the /products route
*/

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
        res.status(200).json(docs);
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        message: err
      });
    });
});

router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), /* creates a new unique ID */
        name: req.body.name,
        price: req.body.price
    });
    product.save()
        .then((result) => {
          console.log(result);
          /* saved it into the database. */
          res.status(201).json({
            message: "handling POST request to /products",
            createdProduct: product
          });
        }).catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err
          });
    });
});

router.get("/:productID", (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
        .exec()
        .then(doc => {
          console.log("From database", doc);
          if (doc) {
            res.status(200).json(doc);
          } else {
            res.status(404).json({ message: 'No valid entry found for provided ID' });
          }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});


router.patch("/:productID", (req, res, next) => {
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: req.params.productID }, {
    $set: updateOps
  }).exec()
    .then(res => {
      console.log(res);
      res.status(200).json(res);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
  })
});

router.delete("/:productID", (req, res, next) => {
  Product.deleteOne({ _id: req.params.productID })
    .exec()
    .then(res => {
      res.status(200).json(res);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
});
module.exports = router;
