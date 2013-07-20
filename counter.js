/**
 * Created with IntelliJ IDEA.
 * User: joaquimserafim
 * Date: 18/07/13
 * Time: 23:08
 * To change this template use File | Settings | File Templates.
 */
/**
 * Counter class
 * @param element
 * @constructor
 */
function Counter (element) {
  var self = this;
  self.el = element;
  self.totalSeconds = 0;
}
/**
 * Counter - launch counter
 */
Counter.prototype.start = function () {
  var self = this;
  // init setInterval second by second
  self.interval = setInterval(function () {
    // inc totalSeconds
    ++self.totalSeconds;
    // transform into Date object
    var date = new Date(0,0,0,0,0,self.totalSeconds).toTimeString();
    // set value to html "el" returning only hh:mm:ss
    self.el.value = date.substr(0, 8);
  }, 1000);
};
/**
 * Counter - stop counter
 */
Counter.prototype.stop = function () {
  var self = this;
  // stop the setInterval
  clearInterval(self.interval);
};