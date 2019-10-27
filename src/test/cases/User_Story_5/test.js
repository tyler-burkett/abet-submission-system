//const course_portfolio = require('../../../main/lib/course_portfolio')
const { expect } = require('../../chai')
const sinon = require('sinon')

// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();

describe('User Story 3 - Download Course Portfolio', () => {

    describe('summarize', () => {

        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
        })
        
        it('summarizes course', async () => {


        })

    })

    describe('create_course_summary_PDF', () => {
        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
        })

        it('creates PDF', () => {

        })

    })

    describe('create_SLO_PDFs', () => {
        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
        })

        it('creates PDFs', () => {

        })

    })

})