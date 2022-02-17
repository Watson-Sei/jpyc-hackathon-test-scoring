// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ContractTransaction } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const MainContract = await ethers.getContractFactory("Scoring");
  const Scoring = await MainContract.connect(deployer).deploy();
  await Scoring.deployed();
  console.log("Scoring deployed to:", Scoring.address);

  const data: Array<number> = [1, 2, 1, 1, 3, 3, 1, 2, 2, 3];
  let tx: ContractTransaction = await Scoring.connect(deployer).newTestData(
    data
  );
  await tx.wait();

  const Token = await ethers.getContractFactory("NFT");
  const NFTToken = await Token.connect(deployer).deploy(
    Scoring.address,
    "JPYC Hackathon NFT Token",
    "JPYCH"
  );
  await NFTToken.deployed();
  console.log("NFT deployed to:", NFTToken.address);

  tx = await Scoring.connect(deployer).changeNFTAddress(NFTToken.address);
  await tx.wait();

  tx = await Scoring.connect(deployer).changeNFTTokenURI(
    "https://jsonkeeper.com/b/O2V4"
  );
  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
