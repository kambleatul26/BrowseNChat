const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const Twitter = require('twitter')
const socket = require('socket.io');

app.use(cors())

var client = new Twitter({
    consumer_key: 'w27vI4Dphj6KVWUBIP5OHampS',
    consumer_secret: 'NkaVcuZB9VfrQGu4U6Ej4nK3d5i47VWfVS4UWskstaXfgcEeLV',
    access_token_key: '576932502-g4nLgArJEqRsqEtB4iSQrL1VQNIukLxDZ82BAzuw',
    access_token_secret: 'lufF1GxXzbvAhdsCJTh3UVVz1ioHOLoHWFGYzVkzsVAkE'
});

app.get('/', (req, res) => res.send('Hello World!'))

var server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

var io = socket(server)

io.on('connection', soc => {
    console.log('CONN', soc.id)

    soc.on('message', (data) => {
        console.log(data)
        let keyword = `#${data}`
        console.log(keyword);
        client.stream('statuses/filter', {track: keyword}, function(stream) {
            stream.on('data', function(event) {
            //   console.log(event && event.text);
              soc.emit('reply', {
                  name: event.user.screen_name,
                  loc: event.user.location,
                  text: event.text
                });
            });
        
            stream.on('error', function(error) {
              throw error;
            });
        });    
    })
})