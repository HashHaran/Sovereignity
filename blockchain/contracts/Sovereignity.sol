// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "./ISovereignity.sol";
import "../node_modules/@openzeppelin/contracts/utils/Context.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Sovereignity is ISovereignity, Context, ReentrancyGuard {
    mapping(string => address) private _contentOwner;
    mapping(string => mapping(address=> bool)) private _permissionedUsers;

    modifier _ownerOfContentOnly(string calldata contentId) {
        require(_contentOwner[contentId] != address(0), "Content not added yet");
        require(_msgSender() == _contentOwner[contentId], "Not owner of content");
        _;
    }

    function ownerOf(string calldata contentId) public view override returns (address) {
        return _contentOwner[contentId];
    }

    function addContent(string calldata contentId) nonReentrant external override {
        require(_contentOwner[contentId]==address(0), "Content already added and owned.");
        _contentOwner[contentId] = _msgSender();
        emit ContentCreation(contentId, _msgSender(), block.timestamp);
    }

    function deleteContent(string calldata contentId, address[] calldata permUsers) _ownerOfContentOnly(contentId) nonReentrant external override {
        if (permUsers.length!=0) {
            _revokePermissionMulti(contentId, permUsers);
        }
        address currentOwner = _contentOwner[contentId];
        _contentOwner[contentId] = address(0);
        emit ContentDeletion(contentId, currentOwner, block.timestamp);
    }

    function isPermitted(string calldata contentId, address user) public view override returns (bool) {
        return _permissionedUsers[contentId][user] || (user==_contentOwner[contentId]);
    }

    function awardPermission(string calldata contentId, address user) _ownerOfContentOnly(contentId) nonReentrant public override {
        require(!_permissionedUsers[contentId][user], "User already has permission to access content");
        _permissionedUsers[contentId][user] = true;
        emit PermissionGranted(contentId, _msgSender(), user, block.timestamp);
    }

    function _revokePermission(string calldata contentId, address user) internal {
        require(_permissionedUsers[contentId][user], "User does not have permission to access content");
        _permissionedUsers[contentId][user] = false;
        emit PermissionRevoked(contentId, _msgSender(), user, block.timestamp);
    }

    function revokePermission(string calldata contentId, address user) _ownerOfContentOnly(contentId) nonReentrant public override {
        _revokePermission(contentId, user);
    }

    function _revokePermissionMulti(string calldata contentId, address[] calldata users) internal {
        for (uint i = 0; i < users.length; i++) {
            _revokePermission(contentId, users[i]);
        }
    }

    function transferOwnership(string calldata contentId, address newOwner, address[] calldata permUsers) _ownerOfContentOnly(contentId) nonReentrant external override {
        require(newOwner!=address(0), "Cannot transfer ownership to zero address");
        require(newOwner!=_contentOwner[contentId], "Cannot transfer ownership to self");
        _revokePermissionMulti(contentId, permUsers);
        _contentOwner[contentId] = newOwner;
        emit OwnershipTransfered(contentId, _msgSender(), newOwner, block.timestamp);
    }
 
}