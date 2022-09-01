
# Blockchain

This folder contains the smart contracts and other bloclchain related files of the project.

## Local set up
- Install all dependencies including hardhat with the command
```
npm install
```
- Create a .env file like below
```
API_URL = "YOUR_POLYGON_MUMBAI_RPC_URL"
PRIVATE_KEY1 = "YOUR_PRIVATE_KEY_ACCOUNT1"
PRIVATE_KEY2 = "YOUR_PRIVATE_KEY_ACCOUNT2"
PRIVATE_KEY3 = "YOUR_PRIVATE_KEY_ACCOUNT3"
PRIVATE_KEY4 = "YOUR_PRIVATE_KEY_ACCOUNT4"
```
- Run the below command to start your local hardhat blockchain network
```
npx hardhat node
```

## Local Deployment
- Run the below command to deploy the Sovereignity smart contract to hardhat local network
```
npx hardhat run --network localhost scripts/deploy.ts
```

## Local Unit Testing
- The below command will run the unit tests on the contract deployed in the previous step
```
npx hardhat run --network localhost test/Sovereignity-hardhat.ts
```
- The smart contract must pass the tests in written in this step after any change or gas optimization

## Gas Snapshotting
- After any change to the smart contract the below command has to be run to create a snapshot of the gas consuption of the function calls of the smart contract.
```
npx hardhat run --network localhost test/Sovereignity-gas-snapshot.ts
```
-  After running the above command the latest gas consuption of our smart contract will be recorded in **test/__snapshots__/Sovereignity-gas-snapshot.ts.snap**.
- Changes to the above file should be committed to the repository with the change to the smart contract so we can meticulously track the gas consuption of our smart contract as a result of any change or optimization exercise.
