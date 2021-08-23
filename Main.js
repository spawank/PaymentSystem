var express = require('express');
const port = process.env.PORT || 8081;
const paymentRouter = require("./Services/Payment");
const bodyParser = require("body-parser");

initRoutes = (app) => {
    app.use(bodyParser.json({
      limit: "5mb"
    }));
    app.get("/", (req, res) => {
      return res.send("UP");
    });
    app.get('/transactionservice/transaction/:id', paymentRouter.getPaymentById);
    app.post('/transactionservice/transaction/:id', paymentRouter.createTransaction);
    app.get('/transactionservice/types/:type', paymentRouter.getTransactionsByType);
    app.get('/transactionservice/sum/:id', paymentRouter.sumOfAllTransactions);
}

startServer = () => {
  var app = express();
  initRoutes(app);
  app.listen(port, function () {
    console.log("Payment server listening on port " + port);
 }) 
}

startServer();