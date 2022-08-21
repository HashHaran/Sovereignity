// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ISovereignity {
    event ContentCreation(
        string indexed contentId,
        string contentIdString,
        address indexed owner,
        uint256 timeStamp
    );
    event PermissionGranted(
        string indexed contentId,
        string contentIdString,
        address indexed owner,
        address indexed user,
        uint256 timeStamp
    );
    event PermissionRevoked(
        string indexed contentId,
        string contentIdString,
        address indexed owner,
        address indexed user,
        uint256 timeStamp
    );
    event ContentDeletion(
        string indexed contentId,
        string contentIdString,
        address indexed owner,
        uint256 timeStamp
    );
    event OwnershipTransfered(
        string indexed contentId,
        string contentIdString,
        address indexed owner,
        address indexed newOwner,
        uint256 timeStamp
    );

    function ownerOf(string calldata contentId) external view returns (address);

    function addContent(string calldata contentId) external;

    function deleteContent(
        string calldata contentId,
        address[] calldata permUsers
    ) external;

    function awardPermission(string calldata contentId, address user) external;

    function revokePermission(string calldata contentId, address user) external;

    function isPermitted(string calldata contentId, address user)
        external
        returns (bool);

    function transferOwnership(
        string calldata contentId,
        address newOwner,
        address[] calldata permUsers
    ) external;
}
