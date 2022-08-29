import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "@ethersproject/abstract-signer";
import { Wallet } from 'ethers'
import { Sovereignity } from "../typechain-types/Sovereignity"
var fs = require('fs');

describe("Sovereignity", function () {
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

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    describe("Deployment", async function () {
        it("Should return owner correctly for added content", async function () {
            expect(await sovereignity.ownerOf(contentId1)).to.equal(await owner.getAddress());
        });

        it("Should return zero address as owner correctly for content not added yet", async function () {
            expect(await sovereignity.ownerOf(contentId2)).to.equal(ZERO_ADDRESS);
        });

        it("Should have permission for the permitted user", async function () {
            expect(await sovereignity.isPermitted(contentId1, permittedUser.getAddress())).to.equal(true);
        });

        it("Should not have permission for the other user", async function () {
            expect(await sovereignity.isPermitted(contentId1, otherUser.getAddress())).to.equal(false);
        });

    });

    describe("Add Content", async function () {
        it("Should not let same content to be added by another user", async function () {
            await expect(sovereignity.connect(otherUser as Signer).addContent(contentId1)).to.be.revertedWith("Content already added and owned.");
        });

        it("Should not let same content to be added by same user", async function () {
            await expect(sovereignity.connect(owner as Signer).addContent(contentId1)).to.be.revertedWith("Content already added and owned.");
        });

        it("Should emit ContentCreation event", async function () {
            await expect(sovereignity.connect(owner as Signer).addContent(contentId2)).to.emit(sovereignity, "ContentCreation").withArgs(contentId2, contentId2, await owner.getAddress(), anyValue);
        });
    });

    describe("Is Permitted", async function () {
        it("Owner should be permitted", async function () {
            expect(await sovereignity.isPermitted(contentId1, owner.getAddress())).to.be.equal(true);
        });

        it("Permitted User should also be permitted", async function () {
            expect(await sovereignity.isPermitted(contentId1, permittedUser.getAddress())).to.be.equal(true);
        });

        it("Other user should not be prmitted", async function () {
            expect(await sovereignity.isPermitted(contentId1, otherUser.getAddress())).to.be.equal(false);
        });

        it("No user should be permitted for content not added yet", async function () {
            expect(await sovereignity.isPermitted(contentId3, permittedUser.getAddress())).to.be.equal(false);
            expect(await sovereignity.isPermitted(contentId3, owner.getAddress())).to.be.equal(false);
            expect(await sovereignity.isPermitted(contentId3, otherUser.getAddress())).to.be.equal(false);
        });
    });

    describe("Award Permission", async function () {
        it("Emits Permission Granted Event", async function () {
            await expect(sovereignity.connect(owner as Signer).awardPermission(contentId1, otherUser.getAddress())).to.emit(sovereignity, "PermissionGranted").withArgs(contentId1, contentId1, await owner.getAddress(), await otherUser.getAddress(), anyValue);
        });

        it("Should not give permission to already permissioned user", async function () {
            await expect(sovereignity.connect(owner as Signer).awardPermission(contentId1, permittedUser.getAddress())).to.be.revertedWith("User already has permission to access content");
        });

        it("Should change permssion status after calling the method", async function () {
            expect(await sovereignity.isPermitted(contentId1, otherUser.getAddress())).to.be.equal(true);
        });
    });

    describe("Revoke Permission", async function () {
        it("Emits Permission Revoked Event", async function () {
            await expect(sovereignity.connect(owner as Signer).revokePermission(contentId1, otherUser.getAddress())).to.emit(sovereignity, "PermissionRevoked").withArgs(contentId1, contentId1, await owner.getAddress(), await otherUser.getAddress(), anyValue);
        });

        it("Should not revoke permission of user who does not have permission already", async function () {
            await expect(sovereignity.connect(owner as Signer).revokePermission(contentId1, otherUser.getAddress())).to.be.revertedWith("User does not have permission to access content");
        });

        it("Should change permssion status after calling the method", async function () {
            expect(await sovereignity.isPermitted(contentId1, otherUser.getAddress())).to.be.equal(false);
        });
    });

    describe("Transfer Content Ownership", async function () {
        it("Only owner can transfer ownership", async function () {
            await expect(sovereignity.connect(nextOwner as Signer).transferOwnership(contentId2, owner.getAddress(), [])).to.be.revertedWith("Not owner of content");
        });

        it("Emits Ownership Transfered Event", async function () {
            await expect(sovereignity.connect(owner as Signer).transferOwnership(contentId2, nextOwner.getAddress(), [])).to.emit(sovereignity, "OwnershipTransfered").withArgs(contentId2, contentId2, await owner.getAddress(), await nextOwner.getAddress(), anyValue);
        });

        it("Should change ownership after calling the method", async function () {
            expect(await sovereignity.ownerOf(contentId2)).to.be.equal(await nextOwner.getAddress());
        });
    });

    describe("Delete Content", async function () {
        it("Should not let deletion of content not yet added", async function () {
            await expect(sovereignity.deleteContent(contentId3, [])).to.be.revertedWith("Content not added yet");
        });

        it("Should not let deletion of content by any user other than owner", async function () {
            await expect(sovereignity.connect(otherUser as Signer).deleteContent(contentId1, [permittedUser.getAddress()])).to.be.revertedWith("Not owner of content");
        });

        it("Should emit ContentDeletion event", async function () {
            await expect(sovereignity.connect(owner as Signer).deleteContent(contentId1, [permittedUser.getAddress()])).to.emit(sovereignity, "ContentDeletion").withArgs(contentId1, contentId1, await owner.getAddress(), anyValue);
        });

        it("Should revoke all permissions of the content", async function () {
            expect(await sovereignity.isPermitted(contentId1, permittedUser.getAddress())).to.be.equal(false);
        });

        it("Should return zero address as owner after deletion", async function () {
            expect(await sovereignity.ownerOf(contentId1)).to.be.equal(ZERO_ADDRESS);
        });
    });

}); 