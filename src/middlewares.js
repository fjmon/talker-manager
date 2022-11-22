const crypto = require('crypto');
function tokenAl() {
  return crypto.randomBytes(8).toString('hex');
}
module.exports = { tokenAl };