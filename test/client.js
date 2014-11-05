var config = require('./config');
var Helpers = require('./helpers');
var PulsarApi = require('../src');
var PulsarServerJob = require('../node_modules/pulsar-rest-api/lib/pulsar/job');

var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

function testJobExecution(pulsarApi, job, done) {
  var createSpy = sinon.spy(function() {
    job.data.status.should.equal(PulsarServerJob.STATUS.CREATED);
    job.data.id.should.be.above(0);
  });
  job.on('create', createSpy);


  var changeSpy = sinon.spy(function() {
    createSpy.should.have.been.calledOnce;
    job.data.status.should.equal(PulsarServerJob.STATUS.RUNNING);
  });
  job.on('change', changeSpy);

  job.on('close', function() {
    changeSpy.should.have.been.called;
    job.data.status.should.equal(PulsarServerJob.STATUS.FINISHED);
    done();
  });

  pulsarApi.runJob(job);
}

describe('tests of pulsar API', function() {

  this.timeout(4000);

  it('Default instance', function(done) {
    Helpers.createServer(config.single);
    var pulsarApi = new PulsarApi(config.single);
    var job = pulsarApi.createJob('app', 'env', 'task');

    testJobExecution(pulsarApi, job, done);
  });

  it('Auxiliary instance', function(done) {
    var app = 'alice';
    var env = 'production';
    Helpers.createServer(config.multiple.auxiliary[app + '/' + env]);
    var pulsarApi = new PulsarApi(config.multiple);
    var job = pulsarApi.createJob(app, env, 'task');

    testJobExecution(pulsarApi, job, done);
  });

});
