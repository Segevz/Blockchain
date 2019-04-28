
const SHA256 = require('crypto-js/sha256');
const topology = require('fully-connected-topology')
const {
    Blockchain,
    Block,
    Transaction
} = require('./Blockchain.3.js')
const { Wallet } = require('./wallet.js')


let HelloKitty = new Blockchain();
var walletT2 = new Wallet("e0c6cf98de0d4f478725784075f78d3d673d32f66a923ff775feb0a2276cdfb6");
var walletT3 = new Wallet("4ad69131757e95267f0f01bd9b138fde7b78ac3f929225253c51c035d882fda8");

// var t1 = topology('127.0.0.1:4001', ['127.0.0.1:4002', '127.0.0.1:4003']);
// var t2 = topology('127.0.0.1:4002', ['127.0.0.1:4001', '127.0.0.1:4003']);
// var t3 = topology('127.0.0.1:4003', ['127.0.0.1:4001', '127.0.0.1:4002']);

var trans = walletT2.createTransaction(walletT3.getPublicKey(), 100);
HelloKitty.addTransaction(trans);
HelloKitty.minePendingTransactions('reward-address');
console.log(trans);
console.log(HelloKitty.getLatestBlock().transactions);
console.log(HelloKitty.getLatestBlock().bloomfilter.test(trans));
// console.log(validateTransaction(trans));

function validateTransaction(transaction){

  var possibleBlocks = HelloKitty.findPossibleBlocks(transaction);

  for (var i = 0; i < possibleBlocks.length; i++) {
      var merkleTree = possibleBlocks[i].merkleTree;

      var proof = merkleTree.getProof(transaction);
      var rootHash = merkleTree.getRoot().toString('hex');

      if(merkleTree.verify(proof, transaction, rootHash)) {
          return true;
      }
  }
  return false;
}

// t1.on('connection', function(connection, peer) {
//
//   connection.on('data', data => {
//     console.log(data.toString('utf8'));
//     var trans = JSON.parse(data.toString('utf8'));
//     HelloKitty.addTransaction(trans);
//     // while(HelloKitty.minePendingTransactions('reward-address'));
//     HelloKitty.validateTransaction(trans);
//   });
//   // HelloKitty.minePendingTransactions('reward-address');
//   console.log('\nBalance of miner is', HelloKitty.getBalanceOfAddress('reward-address'));
//   // console.log(HelloKitty.chain);
// });
//
// t2.on('connection', function(connection, peer) {
//   console.log("t2 peer is " + peer);
//   const peerIndex = peer.substring(peer.length - 1, peer.length);
//   if (peerIndex === 1){
//     connection.write(walletT2.createTransaction(walletT3.getPublicKey(), 100));
//     connection.write(walletT2.createTransaction(walletT3.getPublicKey(), 50));
//   }else {
//     connection.write(walletT2.getPublicKey());
//   }
//   // HelloKitty.addTransaction(transaction1);
//
//   // var transaction2 = new Transaction(wallet1.getPublicKey(), wallet2.getPublicKey(), 100);
//   // transaction2.signTransaction(wallet1.key);
//   // HelloKitty.addTransaction(transaction2);
//   console.log('\nBalance of ' + walletT2.getPublicKey() + ' is', HelloKitty.getBalanceOfAddress(walletT2.getPublicKey()));
//
// });
//
// t3.on('connection', function(connection, peer) {
//   console.log(peer);
//   // var transaction3 = new Transaction(wallet2.getPublicKey(), wallet1.getPublicKey(), 10);
//   // transaction3.signTransaction(wallet2.key);
//   // HelloKitty.addTransaction(transaction3);
//   //
//   // var transaction4 = new Transaction(wallet2.getPublicKey(), wallet1.getPublicKey(), 20);
//   // transaction4.signTransaction(wallet2.key);
//   // HelloKitty.addTransaction(transaction4);
//   // console.log('\nBalance of '+ wallet2.getPublicKey() +' is', HelloKitty.getBalanceOfAddress(wallet2.getPublicKey()));
//
// });
//
// // HelloKitty.dumpChain()
