import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "@ethersproject/abstract-signer";
import { getAddress } from "ethers/lib/utils";
var fs = require('fs');

describe("Sovereignity", function () {
    //Defining a minimalistic fixture for the Sovereignity, supporting all test cases
    async function deploySovereignityFixture() {
        const [owner, permittedUser, otherUser, nextOwner] = await ethers.getSigners();
        const contentId1 = "QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPU";
        const contentId2 = "QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnaxHBKd";

        var sovereignityAddress: {
            contractAddress: string;
        };
        sovereignityAddress = { contractAddress: "PLACEHOLDER" };
        var data = fs.readFileSync('contractAddress.json', 'utf8')
        sovereignityAddress = JSON.parse(data);
        // console.log(sovereignityAddress);

        const Sovereignity = await ethers.getContractFactory("Sovereignity");
        const sovereignity = Sovereignity.attach(sovereignityAddress.contractAddress);

        await sovereignity.connect(owner as Signer).addContent(contentId1);
        await sovereignity.connect(owner as Signer).awardPermission(contentId1, permittedUser.getAddress());

        return { sovereignity, owner, permittedUser, otherUser, nextOwner, contentId1, contentId2 }
    }

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    describe("Deployment", async function () {
        it("Should return owner correctly for added content", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            expect(await sovereignity.ownerOf(contentId1)).to.equal(await owner.getAddress());
        });

        it("Should return zero address as owner correctly for content not added yet", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            expect(await sovereignity.ownerOf(contentId2)).to.equal(ZERO_ADDRESS);
        });

        it("Should have permission for the permitted user", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            expect(await sovereignity.isPermitted(contentId1, permittedUser.getAddress())).to.equal(true);
        });

        it("Should not have permission for the other user", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            expect(await sovereignity.isPermitted(contentId1, otherUser.getAddress())).to.equal(false);
        });

    });

    describe("Add Content", async function () {
        it("Should not let same content to be added by another user", async function () {
            const { sovereignity, owner, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            await expect(sovereignity.connect(otherUser as Signer).addContent(contentId1)).to.be.revertedWith("Content already added and owned.");
        });

        it("Should not let same content to be added by same user", async function () {
            const { sovereignity, owner, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            await expect(sovereignity.connect(owner as Signer).addContent(contentId1)).to.be.revertedWith("Content already added and owned.");
        });

        it("Should emit ContentCreation event", async function () {
            const { sovereignity, owner, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            await expect(sovereignity.connect(owner as Signer).addContent(contentId2)).to.emit(sovereignity, "ContentCreation").withArgs(contentId2, await owner.getAddress(), anyValue);
        });
    });

    describe("Delete Content", async function () {
        it("Should not let deletion of content not yet added", async function () {
            const { sovereignity, owner, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            await expect(sovereignity.deleteContent(contentId2, [])).to.be.revertedWith("Content not added yet");
        });

        it("Should not let deletion of content by any user other than owner", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            await expect(sovereignity.connect(otherUser as Signer).deleteContent(contentId1, [permittedUser.getAddress()])).to.be.revertedWith("Not owner of content");
        });

        it("Should emit ContentDeletion event", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            await expect(sovereignity.connect(owner as Signer).deleteContent(contentId1, [permittedUser.getAddress()])).to.emit(sovereignity, "ContentDeletion").withArgs(contentId1, await owner.getAddress(), anyValue);
        });

        it("Should revoke all permissions of the content", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            await sovereignity.connect(owner as Signer).deleteContent(contentId1, [permittedUser.getAddress()]);
            expect(await sovereignity.isPermitted(contentId1, permittedUser.getAddress())).to.be.equal(false);
        });

        it("Should return zero address as owner after deletion", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            await sovereignity.connect(owner as Signer).deleteContent(contentId1, [permittedUser.getAddress()]);
            expect(await sovereignity.ownerOf(contentId1)).to.be.equal(ZERO_ADDRESS);
        });
    });

    describe("Is Permitted", async function () {
        it("Owner should be permitted", async function () {
            const { sovereignity, owner, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            expect(await sovereignity.isPermitted(contentId1, owner.getAddress())).to.be.equal(true);
        });

        it("Permitted User should also be permitted", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            expect(await sovereignity.isPermitted(contentId1, permittedUser.getAddress())).to.be.equal(true);
        });

        it("Other user should not be prmitted", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            expect(await sovereignity.isPermitted(contentId1, otherUser.getAddress())).to.be.equal(false);
        });

        it("No user should be permitted for content not added eyet", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            expect(await sovereignity.isPermitted(contentId2, permittedUser.getAddress())).to.be.equal(false);
            expect(await sovereignity.isPermitted(contentId2, owner.getAddress())).to.be.equal(false);
            expect(await sovereignity.isPermitted(contentId2, otherUser.getAddress())).to.be.equal(false);
        });
    });

    describe("Award Permission", async function () {
        it("Emits Permission Granted Event", async function () {
            const { sovereignity, owner, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            await expect(sovereignity.connect(owner as Signer).awardPermission(contentId1, otherUser.getAddress())).to.emit(sovereignity, "PermissionGranted").withArgs(contentId1, await owner.getAddress(), await otherUser.getAddress(), anyValue);
        });

        it("Should not give permission to already permissioned user", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            await expect(sovereignity.connect(owner as Signer).awardPermission(contentId1, permittedUser.getAddress())).to.be.revertedWith("User already has permission to access content");
        });

        it("Should change permssion status after calling the method", async function () {
            const { sovereignity, owner, permittedUser, otherUser, contentId1, contentId2 } = await loadFixture(deploySovereignityFixture);
            expect(await sovereignity.isPermitted(contentId1, otherUser.getAddress())).to.be.equal(false);
            await sovereignity.connect(owner as Signer).awardPermission(contentId1, otherUser.getAddress())
            expect(await sovereignity.isPermitted(contentId1, otherUser.getAddress())).to.be.equal(true);
        });
    });

}); 