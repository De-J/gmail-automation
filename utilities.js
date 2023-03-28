const { gmail } = require('./auth.js');

function getNewMessages() {
  const p = new Promise((resolve, reject) => {
    gmail.users.messages.list(
    {
      userId: 'me',
      q: 'is:unread',
      //maxResults: 50 
    }
    , (err, res) => {
        if (err) 
          reject(err);
        else 
          resolve(res); 
    })
  });

  p.then(res => {
    const messages = res.data.messages;
    console.log(`You have ${messages.length} new message(s)`);
    
    messages.forEach((message, cnt) => {
      console.log(cnt, message.id);
    })
  }).catch((error) => console.log(error));

}


function getMessage(messageId) {
  const p = new Promise((resolve, reject) => {
    gmail.users.messages.get(
    { 
      userId: 'me',
      id: messageId 
    }
    , (err, res) => {
        if (err)
          reject(err);
        else 
          resolve(res);
    })
  });
          
  p.then(res => {

    let blob = res.data.payload.parts[0].body.data;

    let str = Buffer.from(blob, 'base64')
      .toString('utf-8').trim();
    
    console.log(str);
    //console.log(str.split('\r\n'));
    
    /*
    list.forEach(part => {
      let blob = part.body.data;
      let message = Buffer.from(blob, 'base64')
        .toString('utf-8');
      console.log(message);
    }) 
      */
    
  });

}

module.exports = { getNewMessages, getMessage };
