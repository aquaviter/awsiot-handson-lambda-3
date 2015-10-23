var AWS = require('aws-sdk');

exports.handler = function(event, context) {
  console.log('Received event:');
  var value = event.value;
  var iotdata = new AWS.IotData({endpoint: 'data.iot.ap-northeast-1.amazonaws.com'});

  console.log(JSON.stringify(event));

  var thingName = 'edison';
  var params = {
      'payload': '{"state": {"desired": {"led": "on"}}}',
      'thingName': thingName
  };
  iotdata.updateThingShadow(params, function(err, data) {
    if (err) context.fail(err, err.stack); // an error occurred
    else context.succeed(data.payload);
  });
};
