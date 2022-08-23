import { BigInt, Bytes, Entity, store, ethereum, Address } from "@graphprotocol/graph-ts"
import { log } from '@graphprotocol/graph-ts'
import {
  Sovereignity,
  ContentCreation,
  ContentDeletion,
  OwnershipTransfered,
  PermissionGranted,
  PermissionRevoked
} from "../generated/Sovereignity/Sovereignity"
import { Content, ContentPermission } from "../generated/schema"
import { newMockEvent } from "matchstick-as/assembly/index"

export function handleContentCreation(event: ContentCreation): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  log.info("Inside handleContentCreation", []);
  let contentEntity = new Content(event.params.contentId); //Content ID is an unique identifier in this table
  log.info("After new Content", []);
  // Entity fields can be set using simple assignments

  contentEntity.contentId = event.params.contentIdString;

  // BigInt and BigDecimal math are supported
  contentEntity.owner = event.params.owner;

  // Entity fields can be set based on event parameters
  contentEntity.creationTimeStamp = event.params.timeStamp;

  // Entities can be written to the store with `.save()`
  contentEntity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.isPermitted(...)
  // - contract.ownerOf(...)
}

export function handleContentDeletion(event: ContentDeletion): void {
  store.remove('Content', event.params.contentId.toHexString());
}

export function handleOwnershipTransfered(event: OwnershipTransfered): void {
  let contentEntity = Content.load(event.params.contentId);
  if (contentEntity != null) {
    contentEntity.owner = event.params.newOwner;
    contentEntity.save();
  }
}

export function handlePermissionGranted(event: PermissionGranted): void {
  const id = event.params.contentId.concat(event.params.user); //Contract makes sure that one user has permission only once to a content id, os it will be unique
  let contentPermissionEntity = new ContentPermission(id);
  contentPermissionEntity.content = event.params.contentId;
  contentPermissionEntity.permittedUser = event.params.user;
  contentPermissionEntity.permittedTimeStamp = event.params.timeStamp;
  contentPermissionEntity.save();
}

export function handlePermissionRevoked(event: PermissionRevoked): void {
  const id = event.params.contentId.concat(event.params.user); //Contract makes sure that one user has permission only once to a content id, os it will be unique
  store.remove('ContentPermission', id.toHexString());
}

export function createContentCreationEvent(contentId: string, owner: string, timeStamp: BigInt): ContentCreation {
  log.info("Inside createContentCreationEvent", []);
  let mockEvent = newMockEvent();
  let newContentCreationEvent: ContentCreation = new ContentCreation(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );
  newContentCreationEvent.parameters = new Array();
  let contentIdParam = new ethereum.EventParam('contentId', ethereum.Value.fromBytes(Bytes.fromUTF8(contentId)));
  let contentIdStringParam = new ethereum.EventParam('contentIdString', ethereum.Value.fromString(contentId));
  let ownerParam = new ethereum.EventParam(
    'owner',
    ethereum.Value.fromAddress(Address.fromString(owner))
  );
  let timeStampParam = new ethereum.EventParam('timeStamp', ethereum.Value.fromUnsignedBigInt(timeStamp));

  newContentCreationEvent.parameters.push(contentIdParam);
  newContentCreationEvent.parameters.push(contentIdStringParam);
  newContentCreationEvent.parameters.push(ownerParam);
  newContentCreationEvent.parameters.push(timeStampParam);

  log.info("Returning from createContentCreationEvent", []);
  return newContentCreationEvent;
}

export function createPermissionRevokedEvent(contentId: string, owner: string, user: string, timeStamp: BigInt): PermissionRevoked {
  let mockEvent = newMockEvent();
  let newPermissionRevokedEvent = new PermissionRevoked(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );
  newPermissionRevokedEvent.parameters = new Array();
  let contentIdParam = new ethereum.EventParam('contentId', ethereum.Value.fromBytes(Bytes.fromUTF8(contentId)));
  let contentIdStringParam = new ethereum.EventParam('contentIdString', ethereum.Value.fromString(contentId));
  let ownerParam = new ethereum.EventParam(
    'owner',
    ethereum.Value.fromAddress(Address.fromString(owner))
  );
  let userParam = new ethereum.EventParam(
    'user',
    ethereum.Value.fromAddress(Address.fromString(user))
  );
  let timeStampParam = new ethereum.EventParam('timeStamp', ethereum.Value.fromUnsignedBigInt(timeStamp));

  newPermissionRevokedEvent.parameters.push(contentIdParam);
  newPermissionRevokedEvent.parameters.push(contentIdStringParam);
  newPermissionRevokedEvent.parameters.push(ownerParam);
  newPermissionRevokedEvent.parameters.push(userParam);
  newPermissionRevokedEvent.parameters.push(timeStampParam);

  return newPermissionRevokedEvent;
}

export function createPermissionGrantedEvent(contentId: string, owner: string, user: string, timeStamp: BigInt): PermissionGranted {
  let mockEvent = newMockEvent();
  let newPermissionGrantedEvent = new PermissionGranted(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );
  newPermissionGrantedEvent.parameters = new Array();
  let contentIdParam = new ethereum.EventParam('contentId', ethereum.Value.fromBytes(Bytes.fromUTF8(contentId)));
  let contentIdStringParam = new ethereum.EventParam('contentIdString', ethereum.Value.fromString(contentId));
  let ownerParam = new ethereum.EventParam(
    'owner',
    ethereum.Value.fromAddress(Address.fromString(owner))
  );
  let userParam = new ethereum.EventParam(
    'user',
    ethereum.Value.fromAddress(Address.fromString(user))
  );
  let timeStampParam = new ethereum.EventParam('timeStamp', ethereum.Value.fromUnsignedBigInt(timeStamp));

  newPermissionGrantedEvent.parameters.push(contentIdParam);
  newPermissionGrantedEvent.parameters.push(contentIdStringParam);
  newPermissionGrantedEvent.parameters.push(ownerParam);
  newPermissionGrantedEvent.parameters.push(userParam);
  newPermissionGrantedEvent.parameters.push(timeStampParam);

  return newPermissionGrantedEvent;
}


export function createContentDeletionEvent(contentId: string, owner: string, timeStamp: BigInt): ContentDeletion {
  let mockEvent = newMockEvent();
  let newContentDeletionEvent = new ContentDeletion(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );
  newContentDeletionEvent.parameters = new Array();
  let contentIdParam = new ethereum.EventParam('contentId', ethereum.Value.fromBytes(Bytes.fromUTF8(contentId)));
  let contentIdStringParam = new ethereum.EventParam('contentIdString', ethereum.Value.fromString(contentId));
  let ownerParam = new ethereum.EventParam(
    'owner',
    ethereum.Value.fromAddress(Address.fromString(owner))
  );
  let timeStampParam = new ethereum.EventParam('timeStamp', ethereum.Value.fromUnsignedBigInt(timeStamp));

  newContentDeletionEvent.parameters.push(contentIdParam);
  newContentDeletionEvent.parameters.push(contentIdStringParam);
  newContentDeletionEvent.parameters.push(ownerParam);
  newContentDeletionEvent.parameters.push(timeStampParam);

  return newContentDeletionEvent;
}

export function createOwnershipTransferedEvent(contentId: string, owner: string, newOwner: string, timeStamp: BigInt): OwnershipTransfered {
  let mockEvent = newMockEvent();
  let newOwnershipTransferedEvent = new OwnershipTransfered(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );
  newOwnershipTransferedEvent.parameters = new Array();
  let contentIdParam = new ethereum.EventParam('contentId', ethereum.Value.fromBytes(Bytes.fromUTF8(contentId)));
  let contentIdStringParam = new ethereum.EventParam('contentIdString', ethereum.Value.fromString(contentId));
  let ownerParam = new ethereum.EventParam(
    'owner',
    ethereum.Value.fromAddress(Address.fromString(owner))
  );
  let newOwnerParam = new ethereum.EventParam(
    'newOwner',
    ethereum.Value.fromAddress(Address.fromString(newOwner))
  );
  let timeStampParam = new ethereum.EventParam('timeStamp', ethereum.Value.fromUnsignedBigInt(timeStamp));

  newOwnershipTransferedEvent.parameters.push(contentIdParam);
  newOwnershipTransferedEvent.parameters.push(contentIdStringParam);
  newOwnershipTransferedEvent.parameters.push(ownerParam);
  newOwnershipTransferedEvent.parameters.push(newOwnerParam);
  newOwnershipTransferedEvent.parameters.push(timeStampParam);

  return newOwnershipTransferedEvent;
}