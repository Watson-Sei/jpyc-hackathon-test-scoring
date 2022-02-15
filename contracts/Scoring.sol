//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Scoring {

    uint[] private data;
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == msg.sender);
        _;
    }

    // 新しい問題を追加する関数
    function newTestData(uint[] memory _data) public onlyOwner {
        // 新しいデータに置き換える
        data = _data;
        console.log("add done");
    }

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
}