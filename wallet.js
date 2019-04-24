const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Wallet {
  constructor(privateKey) {
    this.key = ec.keyFromPrivate(privateKey);
  }
  getPublicKey() {
    return this.key.getPublic('hex');
  }
  getPrivateKey() {
    return this.key.getPrivate();
  }
}
module.exports.Wallet = Wallet;
