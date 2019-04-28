const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {
    Transaction
} = require('./Blockchain.3.js')
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
  createTransaction(toAddress, amount){
    var transaction = new Transaction(this.getPublicKey(), toAddress, amount);
    transaction.signTransaction(this.key);
    return transaction;
  }
}
module.exports.Wallet = Wallet;
