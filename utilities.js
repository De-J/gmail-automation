const { fetchMessageList, fetchMessage, sendMessage } = require('./promises.js');
const fs = require('fs').promises;
const { Buffer } = require('node:buffer');

const getHeaders = async (param, isList = false, returnAll = false) => {
  /*
  *
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
    const res = await fetchMessage(param);
    headers = res.data.payload.headers;
  }
  else
    headers = param;

  if (returnAll)
    return headers;
  else
    return headers.filter(obj => (obj.name == "From" || obj.name == "To" || obj.name == "Subject"));
}

const showNewMessages = async (labelIds = []) => {
  try {
    const res = await fetchMessageList(labelIds);
    const messages = res.data.messages;
    if (messages) {
      console.log(`You have ${messages.length} new message(s)`);

      messages.forEach((message, cnt) => {
        console.log(cnt + 1, message.id);
      })
    }
    return messages;
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

    const list = await getHeaders(headers, true);
    list.forEach(header => {
      console.log(`${header.name} : ${header.value}\n`)
    });

    let arr = Buffer.from(blob, 'base64').toString('utf-8').trim().split('\r\n');
    let message = "";
    arr.forEach((ele, idx) => {
      arr[idx] = arr[idx].trim();
      if (arr[idx].length != 0)
        message += arr[idx] + '\n';
    });

    console.log(`Mail-body (plaintext):\n${message}`);
  }
  catch (err) {
    console.log(err);
  }
}

const composeAndSend = async (headers) => {
  let mail = '';
  for (let header of headers) {
    switch (header.name) {
      case 'From':
        mail += "To: "
        break;
      case 'Subject':
        mail += "Subject: "
        break;
      default:
    }
    if (header.name != 'To')
      mail += `${header.value}\n`
  }
  const mailBody = await fs.readFile('./message.txt', 'utf-8');
  mail += '\n' + mailBody;
  console.log(`Your mail body is "${mail}"`);
  const base64Blob = Buffer.from(mail).toString('base64');
  console.log(base64Blob);
  const webSafeBase64Blob = base64Blob.replaceAll('+', '-').replaceAll('/', '_');
  const res = await sendMessage(webSafeBase64Blob);
  console.log(res);
}



module.exports = { composeAndSend, showNewMessages, showMessage, getHeaders };
