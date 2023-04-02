const { getHeaders, composeAndSend, showNewMessages, showMessage } = require('./utilities.js');
const { gmail } = require('./auth.js');

let id = '186f921d25efe376';

//Immediately invoked function expression (or IIFE)
(async function () {
  const headers = await getHeaders(id);
  console.log(headers);
  composeAndSend(headers);
})();



//setInterval(checkForNewEmails, Math.floor(Math.random() * (120 - 45 + 1)) + 45);
