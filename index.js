

/**
 * Dependencies
 */

var format = require('util').format;
var ms = require('ms');

/**
 * Options
 */

var defaultOptions = {};

defaultOptions.indent = 2;
defaultOptions.format_input = ':date method=:method path=:path status=:status time=:time body=:body :custom';
defaultOptions.format_output = ':date method=:method path=:path status=:status time=:time body=:body :custom';
defaultOptions.filter = ['password', 'password_confirmation'];
defaultOptions.customData = function(){return ''};

/**
 * Expose middleware
 */

module.exports = function (conf) {
  return function *(next) {
    yield log(Object.assign(defaultOptions, conf, this), next);
  }
};

/**
 * Log requests
 */

function * log (options, next, self) {
  var start = Date.now();
  // if error occurs
  // catch it, store it
  // log the failed request
  // and then throw it again
  var err;

  try {
    yield next;
  } catch (e) {
    err = e;
    self.status = err.status || 500;
  }

  var end = Date.now();
  var customData = null;
  try{
    customData = options.customData();

    if(typeof customData === 'object')
      customData = JSON.stringify(customData);
  }catch(e){
    customData = '';
  }
  var params = {
    date: new Date(start).toISOString(),
    method: self.method.toUpperCase(),
    path: self.url,
    status: self.status,
    time: ms(end - start),
    body: JSON.stringify(self.request.body || {}),
    custom: options.customData()
  };

  var output = options.format_input;

  Object.keys(params).forEach(function (param) {
    output = output.replace(':' + param, params[param]);
  });

  // insert spaces
  output = indent(output);

  console.log('->' + output);

  params.body = JSON.stringify(self.body || {});
  params.date = new Date(end).toISOString();

  output = options.format_output;

  Object.keys(params).forEach(function (param) {
    output = output.replace(':' + param, params[param]);
  });

  // insert spaces
  output = indent(output);

  console.log('<-' + output);

  if (err) throw err;
}


/**
 * Utilities
 */
function indent (str) {
  return new Array(options.indent + 1).join(' ') + str;
}

