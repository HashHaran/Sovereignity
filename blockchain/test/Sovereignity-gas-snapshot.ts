import snapshotGasCost from '@uniswap/snapshot-gas-cost'
import { ethers } from "hardhat";
import { Signer } from "@ethersproject/abstract-signer";
import { Wallet } from 'ethers'
import { Sovereignity } from "../typechain-types/Sovereignity";
var fs = require('fs');

describe('gas tests', () => {
    //Defining a minimalistic fixture for the Sovereignity, supporting all test cases
    let owner: Wallet, permittedUser: Wallet, otherUser: Wallet, nextOwner: Wallet;
    let sovereignity: Sovereignity;
    const contentId1 = "QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPW";
    const contentId2 = "QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnaxHBKf";
    const contentId3 = "QmY7Yh4UquoXHLPFo2XbhXkhBvFoakdQUSa92pxnaxHBKf";
    async function sovereignityDeployedFixture() {
        var sovereignityAddress: {
            contractAddress: string;
        };
        sovereignityAddress = { contractAddress: "PLACEHOLDER" };
        var data = fs.readFileSync('contractAddress.json', 'utf8')
        sovereignityAddress = JSON.parse(data);
        // console.log(sovereignityAddress);

        const Sovereignity = await ethers.getContractFactory("Sovereignity");
        const sovereignity: Sovereignity = Sovereignity.attach(sovereignityAddress.contractAddress);

        const contentAdditionTx = await sovereignity.connect(owner as Signer).addContent(contentId1);
        await contentAdditionTx.wait();
        const awardPermissionTx = await sovereignity.connect(owner as Signer).awardPermission(contentId1, permittedUser.getAddress());
        await awardPermissionTx.wait();

        return sovereignity;
    }

    before('create fixture loader', async () => {
        [owner, permittedUser, otherUser, nextOwner] = await (ethers as any).getSigners();
        sovereignity = await sovereignityDeployedFixture();
    });
    
    it('gas snapshot for add content', async () => {
        await snapshotGasCost(sovereignity.connect(owner as Signer).addContent(contentId2));
    })
    
    it('gas snapshot for owner of', async () => {
        await snapshotGasCost(sovereignity.estimateGas.ownerOf(contentId1));
    })

    it('gas snapshot for award permission', async () => {
        await snapshotGasCost(sovereignity.connect(owner as Signer).awardPermission(contentId2, otherUser.getAddress()));
    })

    it('gas snapshot for revoke permission', async () => {
        await snapshotGasCost(sovereignity.connect(owner as Signer).revokePermission(contentId2, otherUser.getAddress()));
    })

    it('gas snapshot for is permitted', async () => {
        await snapshotGasCost(sovereignity.estimateGas.isPermitted(contentId1, permittedUser.getAddress()));
    })

    it('gas snapshot for transfer content', async () => {
        await snapshotGasCost(sovereignity.connect(owner as Signer).transferOwnership(contentId2, nextOwner.getAddress(), []));
    })

    it('gas snapshot for delete content', async () => {
        await snapshotGasCost(sovereignity.connect(nextOwner as Signer).deleteContent(contentId2, []));
    })
})