import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { assert } from "console";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("JPYC Hackathon Scoring Contract Test", function () {
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  let Scoring: Contract;
  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    // deploy main contract
    const MainContract = await ethers.getContractFactory("Scoring");
    Scoring = await MainContract.connect(owner).deploy();
    assert(await Scoring.deployed(), "contract was not deployed");
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
});
