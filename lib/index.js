"use strict";

const Promise = require("bluebird");
const request = require("request-promise");
const errors = require("request-promise/errors");

class CleverBotIO {

  /**
   * [constructor description]
   * @constructor
   * @param  {string}    user   [description]
   * @param  {string}    key    [description]
   * @param  {string}    [nick] [description]
   */
  constructor(user, key, nick) {
    this.user = user;
    this.key = key;
    this.nick = nick || "";
    this.url = "https://cleverbot.io/1.0/";
  }

  /**
   * [setNick description]
   * @method setNick
   * @param  {[type]} nick [description]
   */
  setNick(nick) {
    this.nick = nick;
  }

  /**
   * [setURL description]
   * @method setURL
   * @param  {[type]} url [description]
   */
  setURL(url) {
    this.url = url;
  }

  /**
   * [create description]
   * @method create
   * @return {[type]} [description]
   */
  create() {
    let that = this;
    return new Promise(function (resolve, reject) {
      that._request("POST", "create", {
        user: that.user,
        key: that.key,
        nick: that.nick
      }).then(function (res) {
        // Parse the response from the API.
        let response = JSON.parse(res.body);
        // Check to see if the request to create a bot session / nick was successful.
        if (response.status === "success") {
          that.nick = response.nick;
          resolve(response);
        }
        // Check to see if the API returned with an error about the nick being used already.
        if (response.status === "Error: reference name already exists") {
          reject("Error: reference name '" + that.nick +"' already exists");
        }
        // Reject the Promise if we get any other status from the API.
        reject(response);
      }).catch(errors.StatusCodeError, function (err) {
        if (err.statusCode === 404) {
          reject("API endpoints unreachable.");
        }
        reject(err);
      });
    });
  }

  /**
   * [ask description]
   * @method ask
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  ask(message) {
    let that = this;
    return new Promise(function (resolve, reject) {
      that._request("POST", "ask", {
        user: that.user,
        key: that.key,
        nick: that.nick,
        text: message
      }).then(function (res) {
        // Parse the response from the API.
        let response = JSON.parse(res.body);
        // Check to see if the request to ask the API for a response was successful.
        if (response.status === "success") {
          resolve(response);
        }
        // Reject the Promise if we get any other status from the API.
        reject(response);
      }).catch(errors.StatusCodeError, function (err) {
        if (err.statusCode === 404) {
          reject("API endpoints unreachable.");
        }
        reject(err);
      });
    });
  }

  /**
   * This method handles any requests to the CleverBotIO API.
   * @method request
   * @param  {string} method   The method type for the request.
   * @param  {string} endpoint The endpoint to request too on the CleverBotIO API.
   * @param  {object} [data]   Any data to send in the request.
   * @return {*}               The request promise resolved / rejected method for the request.
   */
  _request(method, endpoint, data) {
    return request({
      method: method.toUpperCase(),
      url: this.url + endpoint,
      form: data,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CleverBotIO)"
      },
      resolveWithFullResponse: true
    });
  }
}

module.exports = CleverBotIO;
