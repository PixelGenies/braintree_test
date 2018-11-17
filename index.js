var braintree = require("braintree");
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

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
    customerId: "aCustomerId"
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
    var nonceFromTheClient = req.params.payment_method_nonce;
    // Use payment method nonce here
    gateway.transaction.sale({
      amount: "10.00",
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true
      }
    }, function (err, result) {
        res.send('OK');
    }
    );
  }
);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
