const express = require('express')
const helmet = require('helmet')
//var normalizePort = require('../../../../bin/www')
const { router, course_page_handler } = require("../../../main/routes/course")
const { expect } = require('../../chai')
const sinon = require('sinon')
const request = require('supertest')
const html = require('../../../main/common/html')
const {validationResult} = require('express-validator');

// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();

// Need to create a test app that builds on top of the router
// in order to test by sending http requests
app = express()
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({
    extended: false
  }));
app.use('/test', router);

// replace main function of handlers with test functions in order to
// verify sanization/verification has occured
course_page_handler.get = (req, res, next) => {
    // check for sanitation errors; 
    // respond with Unprocessable Entity code (422) if errors occured
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    // echo parameter to observe sanitization results
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(JSON.stringify(req.params));
}

course_page_handler.post = (req, res, next) => {
    // check for sanitation errors; 
    // respond with Unprocessable Entity code (422) if errors occured
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    // echo body to observe sanitization results
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(JSON.stringify({'params': req.params, 'body': req.body}));
}

describe('User Story 12 - Input Sanitation', function() {

     // this is ran after each unit test
    afterEach(() => {
        // this is needed to restore any states changed by tests back to there original states
        // we don't want to break all future unit tests
        sandbox.restore()
    })

    it('Validates paramaters of requests', async () => {
        //Arrange
        const test_data = {
            'department': 1,
            'course_number': 498,
            'semester': 1,
            'course_year': 2019,
            'num_students': 5,
            'course_section': 1,
            'slo_1': 'on',
            'slo_2': 'on'
        };
        const bad_test_data = {
            'department': '1',
            'course_number': '498',
            'semester': '1',
            'course_year': '2019',
            'num_students': '5',
            'course_section': '1',
            'slo_1': 1,
            'slo_2': 2
        };
        
        //Act
        const response_get = await request(app)
                                    .get('/test/new');
        const response_post = await request(app)
                                    .post('/test/new')
                                    .send(test_data);
        const response_bad = await request(app)
                                    .post('/test/new')
                                    .send(bad_test_data);

        //Assert
        expect(response_get.statusCode).to.be.equal(200);
        expect(response_post.statusCode).to.be.equal(200);
        expect(JSON.parse(response_get.text)).to.deep.equal({
            'id':'new'
        });
        expect(JSON.parse(response_post.text)).to.deep.equal({
            'params': {
                'id':'new'
            },
            'body' : {
            'department': 1,
            'course_number': 498,
            'semester':1,
            'course_year': 2019,
            'num_students': 5,
            'course_section': 1,
            'slo_1': 'on',
            'slo_2': 'on'
        }});
        expect(response_bad.statusCode).to.be.equal(422);

    })

    it('Trims excess white space on requests with strings', async () => {
        //Arrange
        var test_data = {
            'department': 1,
            'course_number': 498,
            'semester':1,
            'course_year': 2019,
            'num_students': 5,
            'course_section': 1,
            'slo_1': 'on    ',
            'slo_2': '    on'
        };

        //Act
        const response = await request(app)
                                    .post('/test/new')
                                    .send(test_data);

        //Assert
        expect(response.statusCode).to.be.equal(200);
        expect(JSON.parse(response.text)).to.deep.equal({
            'params': {
                'id':'new'
            },
            'body' : {
            'department': 1,
            'course_number': 498,
            'semester':1,
            'course_year': 2019,
            'num_students': 5,
            'course_section': 1,
            'slo_1': 'on',
            'slo_2': 'on'
        }});


    })

    it('Escapes "dangerous" characters ()', async () => {
        //Arrange
        const test_data = {
            'department': 1,
            'course_number': 498,
            'semester':1,
            'course_year': 2019,
            'num_students': 5,
            'course_section': 1,
            'slo_1': '`\\',
            'slo_2': '<script> alert("error"); alert(\'error\') </script>'
        };


        //Act
        const response = await request(app)
                                    .post('/test/new')
                                    .send(test_data);

        //Assert
        expect(response.statusCode).to.be.equal(200);
        expect(JSON.parse(response.text)).to.deep.equal({
            'params': {
                'id':'new'
            },
            'body' : {
            'department': 1,
            'course_number': 498,
            'semester':1,
            'course_year': 2019,
            'num_students': 5,
            'course_section': 1,
            'slo_1': '&#96;&#x5C;',
            'slo_2': '&lt;script&gt; alert(&quot;error&quot;); alert(&#x27;error&#x27;) &lt;&#x2F;script&gt;'
        }});
    })
})
