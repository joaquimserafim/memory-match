/*global ActiveXObject*/
/**
 * Request
 * @returns {Request}
 * @constructor
 */
function Request () {
  var self = this;// current scope
  // protection of constructor
  if (!(self instanceof Request)) {
    return new Request();
  }
}
/**
 *
 */
Request.prototype.start = function () {
  var self = this;// current scope
  self.teste = 0;
};
/**
 *
 * @param url
 * @param cb
 */
Request.prototype.load = function (url, cb) {
  var self = this;// current scope
  // HTTP request
  self.myRequest = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  // error event
  self.myRequest.onerror = function () {
    cb(self.myRequest.status, self.myRequest.readyState, self.myRequest.response);
  };
  // abort event
  self.myRequest.onabort = function () {
    cb(self.myRequest.status, self.myRequest.readyState, self.myRequest.response);
  };
  // load event
  self.myRequest.onload = function () {
    cb(self.myRequest.status, self.myRequest.readyState, self.myRequest.response);
  };
  // Initializes a request
  self.myRequest.open('GET', url, true);
  // Sends the request
  self.myRequest.send();
};


