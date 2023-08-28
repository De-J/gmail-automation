const {
  createLabel,
  changeMessageLabels,
  getLabelList
} = require('./promises.js');

const {
  getHeaders,
  composeAndSend,
  showNewMessages
} = require('./utilities.js');

const checkForNewEmails = async (labelId) => {
  const messageIdList = await showNewMessages();
  console.log(`the messageIdList is ${messageIdList}`);
  if (messageIdList) {
    messageIdList.forEach(async (message) => {
      let headers = await getHeaders(message.id);
      await composeAndSend(headers); // send a reply to the sender
      let labelArr = [];
      labelArr.push(labelId);
      await changeMessageLabels(message.id, labelArr);
    })
  }
}

async function main() {
  const labelName = 'automation-label';
  let labelId = '';
  const res = await getLabelList(); // fetch all the labels
  let labelList = res.data.labels;
  labelList.forEach((label) => { // find if labelName already exists
    if (label.name === labelName) { 
      labelId = label.id // if labelName exists copy it's id
      console.log("label exists already");
    }
  })
  if (labelId === '') {
    await createLabel(labelName); // if labelName doesn't exist then create it
    console.log("Label created\n");
  }
  setInterval(() => checkForNewEmails(labelId), 10000);
}

main();

//setInterval(checkForNewEmails, Math.floor(Math.random() * (120 - 45 + 1)) + 45);
