var util = require('util');
var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

/**
 * @param {String} app
 * @param {String} env
 * @param {String} task
 * @param {Object.<String, String>} [taskVariables]
 * @constructor
 */
function Job(app, env, task, taskVariables) {
  this.app = app;
  this.env = env;
  this.task = task;
  this.taskVariables = taskVariables;
  this.data = {};

  EventEmitter.call(this);
}

util.inherits(Job, EventEmitter);

/**
 * @param {Object} jobData
 * @returns {Object} new merged Job's data
 */
Job.prototype.setData = function(jobData) {
  return _.extend(this.data, jobData);
};

Job.prototype.toString = function() {
  var result = util.format('%s "%s" to "%s"', this.task, this.app, this.env);
  if (this.data.id) {
    result += ' id: ' + this.data.id;
  }
  return result;
};

module.exports = Job;
