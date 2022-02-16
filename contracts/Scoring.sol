//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Scoring {

    uint[] private data;
    address private owner;
    address public tokenAddress;
    string public tokenURI;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    // 新しい問題を追加する関数
    function newTestData(uint[] memory _data) public onlyOwner {
        // 新しいデータに置き換える
        data = _data;
        console.log("add done");
    }

    // NFTコントラクトアドレス
    function changeNFTAddress(address _tokenAddress) public onlyOwner returns (address) {
        tokenAddress = _tokenAddress;
        console.log(tokenAddress);
        return tokenAddress;
    }

    // 次に発行するNFTトークンのmetadataの変更
    function changeNFTTokenURI(string memory _data) public onlyOwner {
        tokenURI = _data;
        console.log(tokenURI);
    }

    // 採点スコア計算関数
    function Score(uint[] memory _answer) public view returns (uint) {
        require(data.length == _answer.length, "The number of questions is incorrect.");
        uint score = data.length;
        for (uint i = 0; i < data.length; i++) {
            if (data[i] != _answer[i]) {
                score -= 1;
            }
        }
        return score;
    }

    // 採点スコア計算とNFTトークンの発行関数
    function Judge(uint[] memory _answer) public returns (uint256 id) {
        uint score = Score(_answer);
        if (score * data.length >= data.length * 7) {
            console.log("Pass");
            return Token(tokenAddress).mintToken(msg.sender, tokenURI);
        } else {
            console.log("Failure");
            return 0;
        }
    }
}

interface Token {
    function mintToken(address user, string memory tokenURI) external returns (uint256);
}