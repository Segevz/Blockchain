
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

var t1 = topology('127.0.0.1:4001', ['127.0.0.1:4002', '127.0.0.1:4003']);
var t2 = topology('127.0.0.1:4002', ['127.0.0.1:4001', '127.0.0.1:4003']);
var t3 = topology('127.0.0.1:4003', ['127.0.0.1:4001', '127.0.0.1:4002']);


function validateTransaction(transaction){
    // console.log(transaction);
  let possibleBlocks = HelloKitty.findPossibleBlocks(transaction);
  // console.log(possibleBlocks);

  for (var i = 0; i < possibleBlocks.length; i++) {
      var merkleTree = possibleBlocks[i].merkletree;


      var proof = merkleTree.getProof(SHA256(transaction.signature));
      var rootHash = merkleTree.getRoot().toString('hex');

      if(merkleTree.verify(proof, SHA256(transaction.signature), rootHash)) {
          return true;
      }
  }
  return false;
}

t1.on('connection', function(connection, peer) {

    connection.on('data', data => {
        data = data.toString('utf8');
        console.log("data is " + data);
        var cmd = data.split("#");
        cmd = cmd.filter(x => x)
        for (let i = 0; i < cmd.length; i++) {
            var trans = JSON.parse(cmd[i]);
            let transaction = new Transaction(trans.fromAddress, trans.toAddress, trans.amount)
            transaction.signature = trans.signature;
            transaction.timestamp = trans.timestamp;
            HelloKitty.addTransaction(transaction);
            console.log("is block mined: " + HelloKitty.minePendingTransactions("reward-address"));
            console.log("Balance of miner is " + HelloKitty.getBalanceOfAddress("reward-address") + '\n')
            connection.write(transaction.signature + " ");
        }
    });


});

t2.on('connection', function(connection, peer) {
    const peerIndex = peer.substring(peer.length - 1, peer.length);
    console.log("t2 peer is " + peer + " index " + peerIndex);
  if (peerIndex*1 === 1){
      console.log("on index 1")
      let trans1 = walletT2.createTransaction(walletT3.getPublicKey(), 100);
      let trans2 = walletT2.createTransaction(walletT3.getPublicKey(), 50);
      console.log("adding transaction " + JSON.stringify(trans1));
      connection.write(JSON.stringify(trans1) + "#");
      connection.write(JSON.stringify(trans2) + "#");
      connection.on('data', data => {
          console.log("t2 validating transaction 1 " + validateTransaction(trans1));
          console.log("t2 validating transaction 2 " + validateTransaction(trans2));
      });
  }console.log('\nBalance of ' + walletT2.getPublicKey() + ' is', HelloKitty.getBalanceOfAddress(walletT2.getPublicKey()));

});

t3.on('connection', function(connection, peer) {
    const peerIndex = peer.substring(peer.length - 1, peer.length);
    console.log("t3 peer is " + peer + " index " + peerIndex);
    if (peerIndex*1 === 1){
        console.log("on index 1")
        let trans1 = walletT3.createTransaction(walletT2.getPublicKey(), 10);
        // let trans2 = walletT3.createTransaction(walletT2.getPublicKey(), 5);
        console.log("adding transaction " + JSON.stringify(trans1));
        connection.write(JSON.stringify(trans1) + "#");
        // connection.write(JSON.stringify(trans2) + "#");
        connection.on('data', data => {
            console.log("t3 validating transaction 1 " + validateTransaction(trans1));
            // console.log("t3 validating transaction 2 " + validateTransaction(trans2));
        });
    }
    console.log('\nBalance of ' + walletT2.getPublicKey() + ' is', HelloKitty.getBalanceOfAddress(walletT2.getPublicKey()));
});
setTimeout(function() {
    HelloKitty.dumpChain();
}, 5000)

