# koa-log-requests

Customizable Koa middleware for logging incoming requests.
Outputs method, path, response status, time spent and request body.


### Installation

```
$ npm install koa-log-requests-response --save
```


### Usage

```javascript
var koa = require('koa');
var requests = require('koa-log-requests-response');

var app = koa();

app.use(requests());
app.use(function * (next) {
	this.body = 'Hello World';
	
	yield next;
});

app.listen(3000);
```

Sample:

```
->  2016-05-26T18:19:29.551Z method=POST path=/test/rvs/inapp status=200 time=24ms body={"username":"fortino@ooyala.com","appstore":"roku","sku":"aaaaaaaaaa","receipt":"5AB3663A-AA82-4007-A079-A5DA011E6707"}
<-  2016-05-26T18:19:29.575Z method=POST path=/test/rvs/inapp status=200 time=24ms body={"error":{"message":"Invalid signature","code":401,"type":"Invalid_Signature_"},"success":false}
```


#### Options

There are few options, that you can customize:

```javascript
var requests = require('koa-log-requests-response');

requests.indent = 2; // insert N spaces at the beginning
requests.format_input = ':date :method :path status=:status time=:time body=:body data=:custom'; // format of output
requests.format_output = ':date :method :path status=:status time=:time body=:body data=:custom'; // format of output
requests.filter = ['password', 'password_confirmation']; // filter out these keys from request body
requests.customData = function(){ return 'something'};  //print any information that you want

```


### License
koa-log-requests-response is released under the MIT license.

