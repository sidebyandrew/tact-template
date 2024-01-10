import * as fs from "fs";
import * as path from "path";
import {Address, contractAddress} from "@ton/core";
import {SampleTactContract} from "./output/sample_SampleTactContract";
import {prepareTactDeployment} from "@tact-lang/deployer";
import {_OWNER, _TEST_ONLY} from "./global.config";

(async () => {
    // Parameters
    let packageName = "sample_SampleTactContract.pkg";
    let owner = Address.parse(_OWNER);
    let init = await SampleTactContract.init(owner);

    // Load required data
    let address = contractAddress(0, init);
    let data = init.data.toBoc();
    let pkg = fs.readFileSync(path.resolve(__dirname, "output", packageName));

    // Preparing
    console.log("Uploading package...");
    let prepare = await prepareTactDeployment({pkg, data, testnet: _TEST_ONLY});

    // Deploying
    console.log("============================================================================================");
    console.log("Contract Address");
    console.log("============================================================================================");
    console.log();
    console.log(address.toString({testOnly: _TEST_ONLY}));
    console.log();
    console.log("============================================================================================");
    console.log("Please, follow deployment link");
    console.log("============================================================================================");
    console.log();
    console.log(prepare);
    console.log();
    console.log("============================================================================================");
})();
