var Lab = require('lab');
var Code = require('code');
var Config = require('../../../config');
var Hapi = require('hapi');
var HapiAuthBasic = require('hapi-auth-basic');
var Proxyquire = require('proxyquire');
var AuthPlugin = require('../../../server/auth');
var AdminGroupsPlugin = require('../../../server/api/admin-groups');
var AuthenticatedUser = require('../fixtures/credentials-admin');


var lab = exports.lab = Lab.script();
var ModelsPlugin, request, server, stub;


lab.beforeEach(function (done) {

    stub = {
        AdminGroup: {}
    };

    ModelsPlugin = Proxyquire('../../../server/models', {
        './models/admin-group': stub.AdminGroup
    });

    var plugins = [ HapiAuthBasic, ModelsPlugin, AuthPlugin, AdminGroupsPlugin ];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, function (err) {

        if (err) {
            return done(err);
        }

        done();
    });
});


lab.afterEach(function (done) {

    server.plugins.models.BaseModel.disconnect();

    done();
});


lab.experiment('Admin Groups Plugin Result List', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/admin-groups',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when paged find fails', function (done) {

        stub.AdminGroup.pagedFind = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('paged find failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });


    lab.test('it returns an array of documents successfully', function (done) {

        stub.AdminGroup.pagedFind = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(null, { data: [{}, {}, {}] });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.data).to.be.an.array();
            Code.expect(response.result.data[0]).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admin Groups Plugin Read', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'GET',
            url: '/admin-groups/93EP150D35',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when find by id fails', function (done) {

        stub.AdminGroup.findById = function (id, callback) {

            callback(Error('find by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });


    lab.test('it returns a not found when find by id misses', function (done) {

        stub.AdminGroup.findById = function (id, callback) {

            callback();
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it returns a document successfully', function (done) {

        stub.AdminGroup.findById = function (id, callback) {

            callback(null, { _id: '93EP150D35' });
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admin Groups Plugin Create', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'POST',
            url: '/admin-groups',
            payload: {
                name: 'Sales'
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when create fails', function (done) {

        stub.AdminGroup.create = function (name, callback) {

            callback(Error('create failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });


    lab.test('it creates a document successfully', function (done) {

        stub.AdminGroup.create = function (name, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admin Groups Plugin Update', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/admin-groups/sales',
            payload: {
                name: 'Salez'
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.AdminGroup.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });


    lab.test('it updates a document successfully', function (done) {

        stub.AdminGroup.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admin Groups Plugin Update Permissions', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'PUT',
            url: '/admin-groups/sales/permissions',
            payload: {
                permissions: { SPACE_RACE: true }
            },
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when update fails', function (done) {

        stub.AdminGroup.findByIdAndUpdate = function (id, update, callback) {

            callback(Error('update failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });


    lab.test('it updates a document successfully', function (done) {

        stub.AdminGroup.findByIdAndUpdate = function (id, update, callback) {

            callback(null, {});
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result).to.be.an.object();

            done();
        });
    });
});


lab.experiment('Admin Groups Plugin Delete', function () {

    lab.beforeEach(function (done) {

        request = {
            method: 'DELETE',
            url: '/admin-groups/93EP150D35',
            credentials: AuthenticatedUser
        };

        done();
    });


    lab.test('it returns an error when remove by id fails', function (done) {

        stub.AdminGroup.findByIdAndRemove = function (id, callback) {

            callback(Error('remove by id failed'));
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(500);

            done();
        });
    });


    lab.test('it returns a not found when remove by id misses', function (done) {

        stub.AdminGroup.findByIdAndRemove = function (id, callback) {

            callback(null, 0);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(404);
            Code.expect(response.result.message).to.match(/document not found/i);

            done();
        });
    });


    lab.test('it removes a document successfully', function (done) {

        stub.AdminGroup.findByIdAndRemove = function (id, callback) {

            callback(null, 1);
        };

        server.inject(request, function (response) {

            Code.expect(response.statusCode).to.equal(200);
            Code.expect(response.result.message).to.match(/success/i);

            done();
        });
    });
});
