const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
/* multer is used for parsing formData etc kinda data , which express, bodyParser cannot parse. */

const multer = require('multer');
/* storage strategy for multer , these functions will be executed every time a new file is recveived.*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); //cb->callback.
  },
  filename: function (req, file, cb) {
    cb(null,new Date().toISOString().replace(/:/g, '-')+file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  }else {
    cb(null,false)
  }
}
const upload = multer({
  storage: storage,
  limits: {
  fileSize:1024*1024*5
  },
  fileFilter:fileFilter
});
/* 
this router will handle all incoming get requests
   at the /products route
*/
const ProductsController = require('../controllers/products')

router.get("/", ProductsController.products_get_products);
/* checkAuth will get run first , middlewares get run left to right 
   here we are using upload object of multer to do the parsing of form-data which express does not do. for us.
   and as the body is not yet passed we need the token in the header to be able to access it
*/
router.post("/",checkAuth, upload.single('productImage'),ProductsController.products_create_product);

router.get("/:productID", ProductsController.products_get_product);
router.patch("/:productID",checkAuth, ProductsController.products_patch_product);
router.delete("/:productID",checkAuth, ProductsController.products_delete_product);
module.exports = router;
