// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address private owner;

    constructor(address _owner, string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = _owner;
    }

    function mintToken(address _user, string memory tokenURI) external returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_user, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }
}
