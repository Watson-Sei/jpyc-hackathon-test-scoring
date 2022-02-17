// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { assert } from "console";
import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();

  const MainContract = await ethers.getContractFactory("Scoring");
  const Scoring = await MainContract.connect(owner).deploy();
  assert(await Scoring.deployed(), "contract was not deployed");

  const Token = await ethers.getContractFactory("NFT");
  const NFTToken = await Token.deploy(
    Scoring.address,
    "JPYC Hackathon NFT Token",
    "JPYCH"
  );
  assert(await NFTToken.deployed(), "contract was not dpeloyed");

  // NFTのmetadataの情報を更新します
  await Scoring.connect(owner).changeNFTTokenURI(
    "https://jsonkeeper.com/b/O2V4"
  );
  // NFTアドレスの更新
  await Scoring.connect(owner).changeNFTAddress(NFTToken.address);

  // 問題を登録する
  const data: Array<number> = [0, 1, 1, 0, 1, 0, 0, 1, 1, 0];
  await Scoring.connect(owner).newTestData(data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
