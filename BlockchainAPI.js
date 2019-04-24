const topology = require('fully-connected-topology')
const {
    Blockchain,
    Block,
    Transaction
} = require('./Blockchain.3.js')
const { Wallet } = require('./wallet.js')


let HelloKitty = new Blockchain();
var wallet1 = new Wallet("e0c6cf98de0d4f478725784075f78d3d673d32f66a923ff775feb0a2276cdfb6");
var wallet2 = new Wallet("4ad69131757e95267f0f01bd9b138fde7b78ac3f929225253c51c035d882fda8");

var t1 = topology('127.0.0.1:4001', ['127.0.0.1:4002', '127.0.0.1:4003']);
var t2 = topology('127.0.0.1:4002', ['127.0.0.1:4001', '127.0.0.1:4003']);
var t3 = topology('127.0.0.1:4003', ['127.0.0.1:4001', '127.0.0.1:4002']);

t1.on('connection', function(connection, peer) {
  HelloKitty.minePendingTransactions('reward-address');
  console.log('\nBalance of Bob is', HelloKitty.getBalanceOfAddress('reward-address'));
});

t2.on('connection', function(connection, peer) {
  var transaction1 = new Transaction(wallet1.getPublicKey(), wallet2.getPublicKey(), 200);
  transaction1.signTransaction(wallet1.key);
  HelloKitty.addTransaction(transaction1);

  var transaction2 = new Transaction(wallet1.getPublicKey(), wallet2.getPublicKey(), 100);
  transaction2.signTransaction(wallet1.key);
  HelloKitty.addTransaction(transaction2);
  console.log('\nBalance of address1 is', HelloKitty.getBalanceOfAddress(wallet1.getPublicKey()));

});

t3.on('connection', function(connection, peer) {
  var transaction3 = new Transaction(wallet2.getPublicKey(), wallet1.getPublicKey(), 10);
  transaction3.signTransaction(wallet2.key);
  HelloKitty.addTransaction(transaction3);

  var transaction4 = new Transaction(wallet2.getPublicKey(), wallet1.getPublicKey(), 20);
  transaction4.signTransaction(wallet2.key);
  HelloKitty.addTransaction(transaction4);
  console.log('\nBalance of address2 is', HelloKitty.getBalanceOfAddress(wallet2.getPublicKey()));

});
