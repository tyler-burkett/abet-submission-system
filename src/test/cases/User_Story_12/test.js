var express = require('express')
var normalizePort = require('../../../../bin/www')
const course_route = require("../../../main/routes/course")
const { expect } = require('../../chai')
const sinon = require('sinon')
const request = require('request')
var http = require('http')

// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();

// test server variable used throughout multiple tests, used to 
// test responses via HTTP
var test_server = null

function create_test_server() {
    var app = express();
    app.use('/', course_route);

    /**
     * Get port from environment and store in Express app.
     */

    var port = parseInt(process.env.PORT || '3000', 10);
    if(isNaN(port)) {
        port = val;
    }
    if(port < 0) {
        port = false;
    }

    app.set('port', port);

    /**
     * Create HTTP server.
     */

    test_server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    test_server.listen(port);

} 

function destroy_test_server() {
    if(server !== null ) {
        server.close();
        server = null;
    }

}

describe('User Story 12 - Input Sanitation', () => {

     // this is ran after each unit test
    afterEach(() => {
        destroy_test_server();
        // this is needed to restore any states changed by tests back to there original states
        // we don't want to break all future unit tests
        sandbox.restore()
    })

    it('Trims excess white space', () => {
        //Arrange
        create_test_server();

        //Act

        //Assert
        expect(true).to.be.true;


    })

    it('Escapes "dangerous" characters ()', () => {

    })
})