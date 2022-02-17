# JPYCハッカソンテスト採点＆参加証NFT発行コントラクト(未承認)

## 関数に関して

```solidity
// 新しい問題設定
function newTestData(uint[] memory _data) public onlyOwner;

// NFTコントラクトアドレスの設定
function changeNFTAddress(address _tokenAddress) public onlyOwner returns (address);

// NFTトークン metadataの設定
function changeNFTTokenURI(string memory _data) public onlyOwner;

// 採点
function Score(uint[] memory _answer) public view returns (uint);

// 採点→合格→NFT発行
function Judge(uint[] memory _answer) public returns (uint256 id);

// owner限定で発行できる関数
function mintToken(address user, string memory tokenURI) external returns (uint256);
```
