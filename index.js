const express = require('express');
const bodyParser = require('body-parser');
const HTTPS = require('https');
const util = require('util');
const app = express();
var giphy = require('giphy-api')('JRhlojbUH33AgxmgI2Ai4SNrJ6OQL8ZB');

const port = process.env.PORT || 3000;
const botID = process.env.BOT_ID;

app.set('port', port);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  console.log('Home page');
  res.end();
});

app.post('/groupme', function(req, res) {
  console.log('Got a groupme POST');
  postMessage(req, res)
});

app.get('/groupme', function(req, res) {
  console.log('Got a groupme GET');
  res.end();
});

// Sample Request
// {
//   "attachments": [],
//   "avatar_url": "https://i.groupme.com/123456789",
//   "created_at": 1302623328,
//   "group_id": "1234567890",
//   "id": "1234567890",
//   "name": "John",
//   "sender_id": "12345",
//   "sender_type": "user",
//   "source_guid": "GUID",
//   "system": false,
//   "text": "Hello world ☃☃",
//   "user_id": "1234567890"
// }
function postMessage(request, response) {
  var botResponse, options, body, botReq;

  response.writeHead(200);
  response.end();

  var jsonObj = request.body;
  const kyleRegex = /k|Kyle/;
  const mollieRegex = /m|Mollie/;
  const dallasRegex = /d|Dallas/;
  const gifRegex = /^\/gif/;
  if (gifRegex.test(jsonObj.text)) {
    var searchText = jsonObj.text.substring(jsonObj.text.indexOf("/gif ")+5);
    console.log("GOT A GIF " + searchText);

    giphy.search(searchText, function(err, res) {
      console.log(res.data[0].images.original.url);
    });
  } else if (kyleRegex.test(jsonObj.text) || mollieRegex.test(jsonObj.text) || dallasRegex.test(jsonObj.text)) {
    console.log("HEY CHECK IT");
    botText = "Hey check GroupMe.";

    options = {
      hostname: 'api.groupme.com',
      path: '/v3/bots/post',
      method: 'POST'
    };

    body = {
      'bot_id' : botID,
      'text' : botText
    };

    botReq = HTTPS.request(options, function(res) {
      console.log("Sent message");
    });

    botReq.end(JSON.stringify(body));
  }
}

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
