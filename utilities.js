const { gmail } = require('./auth.js');

function getNewMessages() {
  gmail.users.messages.list(
    {
      userId: 'me',
      maxResults: 50
    }
    , (err, res) => {
        //if (err) console.log("can't fetch");

        const messages = res.data.messages;
        //console.log(res.data);
        let cnt = 0;
        messages.forEach((message) => console.log(++cnt, message.id));
    })
}


function getMessage(messageId) {
  gmail.users.messages.get(
    { 
      userId: 'me',
      id: messageId 
    }
    , (err, res) => {
        if (err) console.log("Unable to fetch the required message");
        
      console.log(res.data.payload.parts[0].body.data);
    })
}

module.exports = { getNewMessages, getMessage };



