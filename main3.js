const {
    Blockchain,
    Block,
    Transaction
} = require('./Blockchain.3.js')
const { Wallet } = require('./wallet.js')

let micaCoin = new Blockchain();
var wallet1 = new Wallet("e0c6cf98de0d4f478725784075f78d3d673d32f66a923ff775feb0a2276cdfb6");
var wallet2 = new Wallet("4ad69131757e95267f0f01bd9b138fde7b78ac3f929225253c51c035d882fda8");

var transaction1 = new Transaction(wallet1.getPublicKey(), wallet2.getPublicKey(), 100);
transaction1.signTransaction(wallet1.key);
micaCoin.addTransaction(transaction1);

var transaction2 = new Transaction(wallet2.getPublicKey(), wallet1.getPublicKey(), 50);
transaction2.signTransaction(wallet2.key);
micaCoin.addTransaction(transaction2);

console.log('\n Starting the miner...');
micaCoin.minePendingTransactions('Bob-address');

console.log('\nBalance of Bob is', micaCoin.getBalanceOfAddress('Bob-address'));

console.log('\n Starting the miner again...');
micaCoin.minePendingTransactions('Bob-address');

console.log('\nBalance of Bob is', micaCoin.getBalanceOfAddress('Bob-address'));
