"use strict";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const CleverBotIO = require("../lib/");

chai.should();
chai.use(chaiAsPromised);

describe("CleverBot IO", function () {

  let client = new CleverBotIO(process.env.CLEVERBOT_USER, process.env.CLEVERBOT_KEY);

  it("creates the client", function () {
    return client.create().should.eventually.have.property("status", "success");
  });

  it("gets a response from asking", function () {
    this.timeout(4000);
    return client.ask("Just a small town girl").should.eventually.have.all.keys("status", "response");
  });
});
