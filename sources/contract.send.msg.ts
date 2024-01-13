import {Address, contractAddress, toNano} from "@ton/core";
import {TonClient4, WalletContractV4} from "@ton/ton";
import {Add, Divide, Minus, Multiply, SampleTactContract} from "./output/sample_SampleTactContract";
import {mnemonicToPrivateKey} from "@ton/crypto";
import {_ENDPOINT_MAINNET, _ENDPOINT_TESTNET, _OWNER, _SEQ, _TEST_ONLY, getKeypairFromFile} from "./global.config";
import fs from "fs";



const Sleep = (ms: number)=> {
    return new Promise(resolve=>setTimeout(resolve, ms))
}

(async () => {
    const client = new TonClient4({
        endpoint: _TEST_ONLY ? _ENDPOINT_TESTNET : _ENDPOINT_MAINNET,
    });

    // open wallet v4 (notice the correct wallet version here)
    let keyPair = await getKeypairFromFile('mnemonics.txt',_TEST_ONLY);
    const wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
    const address = wallet.address;
    console.info("Wallet address (bounceable)" + address.toString({urlSafe:true, bounceable:false, testOnly:_TEST_ONLY}))
    console.info("Wallet address (non-bounceable)" + address.toString({urlSafe:true, bounceable:true, testOnly:_TEST_ONLY}))
    console.info("Wallet address (HEX) " + address.toRawString())
    
    // open wallet and read the current seqno of the wallet
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(keyPair.secretKey);

    // open the contract address
    let owner = Address.parse(_OWNER);
    let init = await SampleTactContract.init(owner,_SEQ);
    let contract_address = contractAddress(0, init);
    let contract = await SampleTactContract.fromAddress(contract_address);
    let contract_open = await client.open(contract);

    // send message to contract
    // await contract_open.send(walletSender, { value: toNano(0.01)}, "increment");

    await Sleep(3000);
    console.log("Counter Value Before : " + (await contract_open.getCounter()));

    // contract_open.send(walletSender, {value: toNano("0.001")}, {
    //     $$type: 'Add', amount: 200n
    // } as Add);

    // contract_open.send(walletSender, {value: toNano("0.002")}, {
    //     $$type: 'Minus', amount: 2n
    // } as Minus);

    // contract_open.send(walletSender, {value: toNano("0.1")}, {
    //     $$type: 'Multiply', amount: 2n
    // } as Multiply);

    contract_open.send(walletSender, {value: toNano("0.1")}, {
        $$type: 'Divide', amount: 3n
    } as Divide);

    console.log("Wait 20s to make sure get the result..... ");
    await Sleep(20000);
    console.log("Counter Value After Msg Call: " + (await contract_open.getGetter()));
})();

