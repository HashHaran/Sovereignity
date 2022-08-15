// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ISovereignity {
    event ContentCreation(string indexed contentId, address indexed owner, uint timeStamp);
    event PermissionGranted(string indexed contentId, address indexed owner, address indexed user, uint timeStamp);
    event PermissionRevoked(string indexed contentId, address indexed owner, address indexed user, uint timeStamp);
    event ContentDeletion(string indexed contentId, address indexed owner, uint timeStamp);
    event OwnershipTransfered(string indexed contentId, address indexed owner, address indexed newOwner, uint timeStamp);

    function ownerOf(string calldata contentId) external view returns (address);
    function addContent(string calldata contentId) external;
    function deleteContent(string calldata contentId, address[] calldata permUsers) external;
    function awardPermission(string calldata contentId, address user) external;
    function revokePermission(string calldata contentId, address user) external;
    function isPermitted(string calldata contentId, address user) external returns (bool);
    function transferOwnership(string calldata contentId, address newOwner, address[] calldata permUsers) external; 
}