import { BigInt } from "@graphprotocol/graph-ts";
import { describe, test, assert, beforeAll } from "matchstick-as/assembly/index"
import {
    handleContentCreation, handleContentDeletion, handlePermissionGranted, handlePermissionRevoked, handleOwnershipTransfered,
    createContentCreationEvent, createContentDeletionEvent, createPermissionGrantedEvent, createPermissionRevokedEvent, createOwnershipTransferedEvent} from "../src/sovereignity"

const contentId1 = "QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPU";
const localHardhatAddress1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const localHardhatAddress2 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const localHardhatAddress3 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";


const timeStamp = 1234;

describe("handleContentCreation()", () => {
    beforeAll(() => {
        let newContentCreationEvent = createContentCreationEvent(contentId1, localHardhatAddress1, BigInt.fromI32(timeStamp));
        handleContentCreation(newContentCreationEvent);
    })

    test("Should create a new Content entity", () => {
        assert.entityCount("Content", 1);
    })

    test("Should create the Content entity with correct params", () => {
        assert.fieldEquals("Content", contentId1, "owner", localHardhatAddress1);
        assert.fieldEquals("Content", contentId1, "creationTimeStamp", timeStamp.toString());
    })
})

describe("handleContentDeletion()", () => {
    beforeAll(() => {
        let newContentDeletionEvent = createContentDeletionEvent(contentId1, localHardhatAddress1, BigInt.fromI32(timeStamp));
        handleContentDeletion(newContentDeletionEvent);
    })

    test("Should reduce the entity count by 1", () => {
        assert.entityCount("Content", 0);
    })
})

describe("handlePermissionGranted()", () => {
    beforeAll(() => {
        let newPermissionGrantedEvent = createPermissionGrantedEvent(contentId1, localHardhatAddress1, localHardhatAddress2, BigInt.fromI32(timeStamp));
        handlePermissionGranted(newPermissionGrantedEvent);
    })

    test("Should create a new ContentPermission entity", () => {
        assert.entityCount("ContentPermission", 1);
    })

    test("Should create the ContentPermission entity with correct params", () => {
        const id = contentId1.concat(localHardhatAddress2); //Contract makes sure that one user has permission only once to a content id, os it will be unique
        assert.fieldEquals("ContentPermission", id, "content", contentId1);
        assert.fieldEquals("ContentPermission", id, "permittedUser", localHardhatAddress2);
        assert.fieldEquals("ContentPermission", id, "permittedTimeStamp", timeStamp.toString());
    })

    describe("handlePermissionRevoked()", () => {
        beforeAll(() => {
            let newPermissionRevokedEvent = createPermissionRevokedEvent(contentId1, localHardhatAddress1, localHardhatAddress2, BigInt.fromI32(timeStamp));
            handlePermissionRevoked(newPermissionRevokedEvent);
        })
    
        test("Should reduce the entity count by 1", () => {
            assert.entityCount("ContentPermission", 0);
        })
    })

    describe("handleOwnershipTransfered()", () => {
        beforeAll(() => {
            let newOwnershipTransferedEvent = createOwnershipTransferedEvent(contentId1, localHardhatAddress1, localHardhatAddress3, BigInt.fromI32(timeStamp));
            handleOwnershipTransfered(newOwnershipTransferedEvent);
        })
    
        test("Should change the owner of the content", () => {
            assert.fieldEquals("Content", contentId1, "owner", localHardhatAddress3);
        })
    })
})