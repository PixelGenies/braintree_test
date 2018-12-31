var braintree = require("braintree");
var express = require('express');
var parser = require("body-parser");
var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.use(parser.urlencoded({extended : true}));
app.use(parser.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.get('/', function(request, response) {
  response.send('Hello World!')
})

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "pp27vfzcd48kbn9f",
  publicKey: "b48s99xwz65hdysd",
  privateKey: "9f14f80af0a78ce7b27ce91cab146ee7"
});

gateway.clientToken.generate({
    customerId: "554362549"
  }, function (err, response) {
    var clientToken = response.clientToken
  }
);

app.get("/client_token", function (req, res) {
    gateway.clientToken.generate({}, function (err, response) {
      res.send(response.clientToken);
    });
  }
);

app.post("/checkout", function (req, res) {
  var nonceFromTheClient = req.body.payment_method_nonce
  // Use payment method nonce here
  //console.log('nonce : ' + nonceFromTheClient)
  //console.log('body : ' + req.body)
  gateway.transaction.sale({
    amount: "10.00",
    paymentMethodNonce: nonceFromTheClient,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    if (result.success) { 
    // See result.transaction for details 
      res.send('OK');
    } else { 
      // Handle errors 
      console.log('result : ' + result)
      console.log('error : ' + err)
      res.send('NOT OK');
    }
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
