# AWS IoT Handson Fundamentals

## Requirements
* Have own AWS account
* PC enables to FDTI driver
* begginer AWS service skil
* beggner level Python programing skill

## Contents
* Handson Text
* Sample Code

## Senario

### Senario1: Visualization
* Publish illumination data to edison/illumination topic
* Invoke Lambda by rule
* Lambda put the data to Elasticsearch, and make dashboard by using kibana
* Archive the illuminance data to DynamoDB

### Senario2: Remote Control
* Turn on/off from web browser by using shadow
* Upload sample code to their S3 bucket

### Senario3: Automation
* If the illumination data is less than xxx, turn on LED, and update state
* If the illumination data is more than xxx, turn off LED and update state

## Settings

### edison
* Install python 2.7.10
* connect illuminance sensor to analog0
* connect LED to digital0
* firmware version should be up-to-date
*

### Certification
* Create 1-click certification, and install them to edison

### IAM role

Lambda role

```
{
  Allow to subscribe edison/illu
}
```

### Policy

Device needs to publish to topic and pub/sub shadow topic in order to get update and update the status.

```
{
  allow to publish to edison/illu, and subscribe/publish to shadow topic
}
```


### MQTT topic
* edison/illumination is for illumination data
* $aws/edison/status/update is for receiving shadow delta  
* $aws/edison/status is for getting current status

### Message Format

Device sends illuminance data by following message format.
```
{
  "timestamp": <epoch timestamp>,
  "device": "edison",
  "sensor": "illu",
  "value": <number>
}
```



### Rules

Put data into DynamoDB and invoke Lambda function to put the data to ES.

```
{
    "sql": "SELECT * FROM 'edison/illu'",
    "ruleDisabled": false,
    "actions": [
        {
            "dynamoDB": {
                "roleArn": "arn:aws:iam::xxxxxxxxxxx:role/iot-role",
                "tableName": "”,
	              "hashKeyField": "topic",
                "hashKeyValue": "things/data",
                "rangeKeyField": "timestamp",
                "rangeKeyValue": "${devicetimestamp}"
            },
            "lambda": {
              "functionArn": "arn:aws:iam::xxxxxxxxxxx:functions/illdata-to-es"
            }
        }
    ]
}
```


Invoke Lambda if illuminance data is too less and too more.
```
{
    "sql": "SELECT * FROM 'edison/illu' WHERE value < 10 OR value > 80",
    "ruleDisabled": false,
    "actions": [
        {
            "lambda": {
              "functionArn": "arn:aws:iam::xxxxxxxxxxx:functions/turn-on-led"
            }
        }
    ]
}
```

### Elasticsearch
* cluster name is awsiot-handson
* t1.micro single node cluster

### shadow

```
{
  "status": {
    "led": "OFF"
  }
}
```

### etc
* publish interval is 1sec
