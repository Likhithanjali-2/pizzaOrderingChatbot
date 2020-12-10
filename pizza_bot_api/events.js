const express = require('express');

function createRouter(db) {
  const router = express.Router();
  router.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','content-type');
    next();
  })
  //to check order status 
  router.get('/orderdetails/id/:orderid', function (req, res, next) {
    db.query(
      'SELECT * FROM orderdetails where orderid = ?',
      [req.params.orderid],
      (error, results) => {
        console.log(error, results);
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
          console.log(results);
        }
      }
    );
  });


  // to make an order
  router.post('/orderdetails', function (req, res, next) {
    db.query(
      'insert into orderdetails (pizzatype,pizzaname,customername,phonenumber,address) values(?,?,?,?,?)',
      [req.body.pizzatype, req.body.pizzaname, req.body.customername, req.body.phonenumber, req.body.address],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'Ok', insertId: results.insertId });
          console.log(results)
        }
      }
    );
  });

  //to cancel an order 
  router.get('/orderdetails/delete/:orderid', function (req, res, next) {
    db.query(
      'delete from orderdetails where orderid = ?',
      [req.params.orderid],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
          console.log(req.params.orderid);

        } else {
          res.status(200).json(results);
          console.log(results)
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;

// curl -X POST --data '{"pizzatype":"nonveg","pizzaname":"panner","customername":"anju","phonenumber":1234567890,"address":"tamilnadu"}' http://localhost:8090/orderdetails -H 'content-type:application/json'


