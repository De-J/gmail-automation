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
    let headers = res.data.payload.headers, i = 0;

    while (headers[i].name !== "From") i++;

    /*
    There are two values inside 'From' header 
    separated by a space. These two values are 
    sender name and sender email.
    */
    
    const sender = headers[i].value.split(' ');


    let arr = Buffer.from(blob, 'base64')
      .toString('utf-8').trim().split('\r\n');

    let message = "";
 
    arr.forEach((ele, idx) => {
      arr[idx] = arr[idx].trim();
      if (arr[idx].length != 0)
        message += arr[idx] + '\n';
    })

    console.log(`\nSender-name: ${sender[0]}\nSender-email: ${sender[1]}\nMail-body (plaintext):\n${message}`);
  });

}

module.exports = { getNewMessages, getMessage };
