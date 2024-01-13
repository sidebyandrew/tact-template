import fs from "fs";
import {mnemonicToPrivateKey} from "@ton/crypto";

export let _TEST_ONLY = false; // [false to use mainnet, true to use testnet]

// https://github.com/ton-community/ton-api-v4
export let _ENDPOINT_MAINNET = "https://mainnet-v4.tonhubapi.com";
export let _ENDPOINT_TESTNET = "https://sandbox-v4.tonhubapi.com";

export let _OWNER = "UQBOop4AF9RNh2DG1N1yZfzFM28vZNUlRjAtjphOEVMd0j-8";

export let _SEQ = 1n;

export async function getKeypairFromFile(filePath:string, testOnly:boolean) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const mnemonics = fileContent.split('\n');

    let mnemonic = mnemonics[0]
    if (mnemonic) {
        return await mnemonicToPrivateKey(mnemonic.split(" "))
    }

    throw new Error("Fail to getKeypairFromFile, please check "+filePath)
}