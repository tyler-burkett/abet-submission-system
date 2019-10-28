//const course_portfolio = require('../../../main/lib/course_portfolio')
var create = require('../../../main/lib/course_portfolio_create')
const { expect } = require('../../chai')
const sinon = require('sinon')

// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();

describe('User Story 5 - Download Course Portfolio', () => {

    describe('summarize', () => {

        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
        })
        
        it('summarizes course', async () => {
            //Arrange

            //Act

            //Assert

        })

    })

    describe('create_course_summary_PDF', () => {
        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
        })

        it('creates course summary PDF', () => {
            //Arrange
            var input = {
                'course_name': '',
                'course_number': 'CS498',
                'instructor_name': 'Ethan Toney',
                'section': 1,
                'semester': 'Fall',
                'year': 2019,
                'number_students' : 5,
                'course_score': 0.88,
                'slo_scores': [0.88],
                'artifact_scores': [0.88, 0.88, 0.88],
                //'evaluation_scores': []  //what does this mean?
            };
            //Act
            //Assert
            expect(() => {return create.create_course_summary_PDF(input)}).to.be.true;

            //TODO: validate PDF; manually or automatically?
        })

        it('throws error on invalid input', () => {
            var input = {
            };
            //Act
            //Assert
            expect(() => {return create.create_course_summary_PDF(input)}).to.throw();

            //TODO: validate no PDF; manually or automatically?
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
            //Arrange
            var input = [{
                'slo_index': 1,
                'slo_description': 'SLO 1',
                'artifact_index': 1,
                'artifact_name': "artifact 1",
                'is_group_assignment': False,
                'number_of_submissions': 1,
                'evaluations': [{
                    'eval_index': 1,
                    'student_index': 1,
                    'evaluation': [],
                    'file': null
                }]
            }, 
            {
                'slo_index': 2,
                'slo_description': 'SLO 2',
                'artifact_index': 2,
                'artifact_name': "artifact 2",
                'is_group_assignment': False,
                'number_of_submissions': 1,
                'evaluations': [{
                    'eval_index': 1,
                    'student_index': 1,
                    'evaluation': [],
                    'file': null
                }]
            }];

            //Act
            //Assert
            expect(() => {return create.create_SLO_PDFs(input)}).to.be.true;
            //TODO: validate PDFs; manually or automatically?
        })

        it('throws error on invalid input', () => {
            //Arrange
            var input = {
            };
            //Act
            //Assert
            expect(() => {return create.create_course_summary_PDF(input)}).to.throw();

            //TODO: validate no PDF; manually or automatically?
        })

    })

})