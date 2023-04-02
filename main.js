const { showNewMessages, showMessage } = require('./utilities.js');
const { gmail } = require('./auth.js');

let id = '186f921d25efe376';
(async function () {
  await showNewMessages();
  showMessage(id);
})();


//setInterval(checkForNewEmails, Math.floor(Math.random() * (120 - 45 + 1)) + 45);
