import { Address, contractAddress, toNano } from "@ton/core";
import { TonClient4, WalletContractV4 } from "@ton/ton";
import {Add, Minus, SampleTactContract} from "./output/sample_SampleTactContract";
import { mnemonicToPrivateKey } from "@ton/crypto";
import {_ENDPOINT_MAINNET, _ENDPOINT_TESTNET, _OWNER, _SECRET_mnemonic, _TEST_ONLY} from "./global.config";

const Sleep = (ms: number)=> {
    return new Promise(resolve=>setTimeout(resolve, ms))
}

(async () => {
    const client = new TonClient4({
        endpoint: _TEST_ONLY ? _ENDPOINT_TESTNET : _ENDPOINT_MAINNET,
    });

    // open wallet v4 (notice the correct wallet version here)
    const mnemonic = _SECRET_mnemonic; // your 24 secret words (replace ... with the rest of the words)
    const key = await mnemonicToPrivateKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    
    // open wallet and read the current seqno of the wallet
    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);

    // open the contract address
    let owner = Address.parse(_OWNER);
    let init = await SampleTactContract.init(owner);
    let contract_address = contractAddress(0, init);
    let contract = await SampleTactContract.fromAddress(contract_address);
    let contract_open = await client.open(contract);

    // send message to contract
    // await contract_open.send(walletSender, { value: toNano(0.01)}, "increment");

    await Sleep(3000);
    console.log(" First Counter Value : " + (await contract_open.getCounter()));

    // contract_open.send(walletSender, {value: toNano("0.01")}, {
    //     $$type: 'Add', amount: 2n
    // } as Add);

    contract_open.send(walletSender, {value: toNano("0.01")}, {
        $$type: 'Minus', amount: 1n
    } as Minus);

    console.log("Wait 20s to make sure get the result..... ");
    await Sleep(20000);
    console.log("Second Counter Value After minus 2: " + (await contract_open.getGetter()));
})();

