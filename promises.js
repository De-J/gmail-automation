const { gmail } = require('./auth.js');
/**
  *
  *
  This file contains wrapper functions for promises.
  Since the same API calls are being used in multiple 
  functions, defining them as promises in a separate
  file reducing code duplication. 
  *
  *
**/

const fetchMessageList = (labelIds = []) => {
  return new Promise((resolve, reject) => {
    gmail.users.messages.list(
      {
        userId: 'me',
        q: 'is:read',
        labelIds: labelIds
        //maxResults: 50
      }
      , (err, res) => {
        if (err)
          reject(err);
        else
          resolve(res);
      });
  });
}


const fetchMessage = (messageId) => {
  return new Promise((resolve, reject) => {
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
      });
  });
}


const sendMessage = (base64Blob) => {
  return new Promise((resolve, reject) => {
    gmail.users.messages.send(
      {
        userId: 'me',
        requestBody: {
          raw: base64Blob
        }
      }
      , (err, res) => {
        if (err)
          reject(err);
        else
          resolve(res);
      });
  });
}

const createLabel = (labelName) => {
  return new Promise((resolve, reject) => {
    gmail.users.labels.create(
      {
        userId: 'me',
        requestBody: {
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
          name: labelName
        }
      },
      (err, res) => {
        if (err)
          reject(err);
        else
          resolve(res);
      });
  })
}

module.exports = { sendMessage, fetchMessageList, fetchMessage, createLabel };
