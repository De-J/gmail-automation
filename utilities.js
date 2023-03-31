const { fetchMessageList, fetchMessage } = require('./promises.js');

const showNewMessages = async () => {
  try {
    const res = await fetchMessageList();
    const messages = res.data.messages;
    console.log(`You have ${messages.length} new message(s)`);
    
    messages.forEach((message, cnt) => {
      console.log(cnt+1, message.id);
    })
  }
  catch (error) {
    console.log(error)
  }
}


const showMessage = async (messageId) => {
  try {
    const res = await fetchMessage(messageId);
    let blob = res.data.payload.parts[0].body.data;
    let headers = res.data.payload.headers;

    getHeaders(headers, true).forEach(header => 
      console.log(`${header.name} : ${header.value}\n`)
    );
      
    let arr = Buffer.from(blob, 'base64').toString('utf-8').trim().split('\r\n');
    let message = "";
    arr.forEach((ele, idx) => {
      arr[idx] = arr[idx].trim();
      if (arr[idx].length != 0)
        message += arr[idx] + '\n';
    });

    console.log(`Mail-body (plaintext):\n${message}`);
  }
  catch(err) {
    console.log(err);
  }
}

function getHeaders(param, isList = false, returnAll = false) {
/**
  
  Returns a list of objects, where each object 
  contains a header name and the corresponding 
  header value as properties. 
  
  The value of isList argument specifies whether 
  the first argument passed is a string (containing
  the message Id) or a list (containing individual
  email headers as objects).

  The value of returnAll argument specifies whether
  to return all the email headers (if true) or only
  To, From and Subject headers.

**/

  let headers = [];
  if (!isList) {
    fetchMessage(param).then(res =>
      headers = res.data.payload.headers
    )
  }
  else
      headers = param;

  if (returnAll)
    return headers;
  else 
    return headers.filter(obj => (obj.name == "From" || obj.name == "To" || obj.name == "Subject"));
}


module.exports = { showNewMessages, showMessage, getHeaders };
