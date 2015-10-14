var aws = require('aws-sdk');
var elasticsearch = require('elasticsearch');

var ES_INDEX = 'device'; // Elasticsearch index name
var ES_TYPE = 'log'; // Elasticsearch index type name
var ES_CLIENT = new elasticsearch.Client({
    // host: 'search-factory-demo-sthekcqwii4rlks6log62zldsa.us-west-1.cloudsearch.amazonaws.com'
    host: 'search-iothandson-s6vk5i2kztfkxryspanslantha.ap-northeast-1.es.amazonaws.com' //Elasticsearch URL:port
});

//start lambda function
exports.handler = function(event, context) {
  console.log('Received event:');
  // Import arguments
	var device = event.device;
	var sensor = event.sensor;
  var timestamp = event.timestamp;
	var value = event.value;

  // Compose payload
  var searchRecords = [];
  var header = {
    "index":{
      "_index": ES_INDEX,
      "_type": ES_TYPE,
      "_id": 'sensor'
    }
  };

  var searchRecord = {
    "device":device,
    "sensor" : sensor,
    "timestamp" : timestamp,
		"value": value
  };
  searchRecords.push(header);
  searchRecords.push(searchRecord);
  console.log(searchRecords);

  // Put a search record
  ES_CLIENT.bulk({
    "body": searchRecords
  }, function(err, resp) {
    if(err){
      console.log(err);
      context.done("error",err);
    }else{
      console.log("Success");
      console.log(resp);
      context.done(null,'success');
    };
  });
};
