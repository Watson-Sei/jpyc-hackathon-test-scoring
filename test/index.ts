import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { assert } from "console";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("JPYC Hackathon Scoring Contract Test", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  let Scoring: Contract;
  let NFTToken: Contract;
  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    // deploy main contract
    const MainContract = await ethers.getContractFactory("Scoring");
    Scoring = await MainContract.connect(owner).deploy();
    assert(await Scoring.deployed(), "contract was not deployed");

    const Token = await ethers.getContractFactory("NFT");
    NFTToken = await Token.deploy(
      Scoring.address,
      "JPYC Hackathon NFT Token",
      "JPYCH"
    );
    assert(await NFTToken.deployed(), "contract was not deployed");
  });
  it("add NewData", async () => {
    // 10問の答えを配列に設定
    const data: Array<number> = [1, 2, 1, 1, 3, 3, 1, 2, 2, 3];
    await Scoring.connect(owner).newTestData(data);
  });
  it("Scoring Scores", async () => {
    // 10問の答えを配列に設定
    const data: Array<number> = [1, 2, 1, 1, 3, 3, 1, 2, 2, 3];
    await Scoring.connect(owner).newTestData(data);

    // addr1が回答を送信
    // ２問ミス
    const answerData: Array<number> = [1, 3, 1, 1, 3, 3, 1, 2, 2, 2];
    const score = await Scoring.connect(addr1).Score(answerData);
    assert(Number(score) === 8, "The scores don't match");

    // 問題数が不正
    const missAnswerData: Array<number> = [1, 2, 3];
    await expect(Scoring.connect(addr1).Score(missAnswerData)).to.be.reverted;
  });
  it("issue NFT after scoring", async () => {
    // 10問の答えを配列に設定
    const data: Array<number> = [1, 2, 1, 1, 3, 3, 1, 2, 2, 3];
    await Scoring.connect(owner).newTestData(data);

    // NFTコントラクト登録
    await Scoring.connect(owner).changeNFTAddress(NFTToken.address);
    assert(
      (await Scoring.tokenAddress()) === NFTToken.address,
      "NFT token contract address is invalid"
    );

    // NFTコントラクトURI登録
    await Scoring.connect(owner).changeNFTTokenURI(
      "https://jsonkeeper.com/b/O2V4"
    );

    // 7割合格回答を提出してNFTをmint
    const answerData: Array<number> = [1, 2, 1, 1, 3, 3, 1, 1, 1, 3];
    await Scoring.connect(addr1).Judge(answerData);
    assert(
      (await NFTToken.balanceOf(addr1.address)).toString() === "1",
      "was not mint"
    );
  });
});
