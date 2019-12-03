//identical copy of User-Story_5 Test Case Course Portfolio Description
// but contains read only date within Course Portfolio


const course_portfolio = require('../../../main/lib/course_portfolio')
var create = require('../../../main/lib/course_portfolio_create')
const { expect } = require('../../chai')
const sinon = require('sinon')
var fs = require('fs-extra')

// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();

// sample input for course portfolio used by multiple tests
var course_input = {
    "id": 1,
    "course_id": 1,
    "instructor_id": 1,
    "semester_term_id": 1,
    "num_students": 5,
    "section": 1,
    "year": 2019,
    "archivedAt": 2022,
    "course": {
        "id": 1,
        "department_id": 1,
        "number": 498,
        "course_name": "Software Engineering for Senior Project",
        "department": {
            "id": 1,
            "identifier": "cs",
            "name": "Computer Science"
        }
    },
    "instructor": {
        "id": 1,
        "instructor_name": "Ethan Toney",
        "linkblue_username": "ethan.toney"
    },
    "semester": {
        "id": 1,
        "type": 1,
        "value": "fall"
    },
    "outcomes": [
        {
            "id": 1,
            "portfolio_id": 1,
            "slo_id": 1,
            "slo": {
                "id": 1,
                "department_id": 1,
                "index": 2,
                "description": "Design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program's discipline.",
                "metrics": [
                    {
                        "id": 1,
                        "slo_id": 1,
                        "index": 1,
                        "name": "Identify and interpret client needs and design constraints",
                        "exceeds": "n/a",
                        "meets": "n/a",
                        "partially": "n/a",
                        "not": "n/a"
                    }
                ]
            },
            "artifacts": [
                {
                    "id": 1,
                    "portfolio_slo_id": 1,
                    "index": 1,
                    "name": "_unset_",
                    "evaluations": [
                        {
                            "id": 1,
                            "artifact_id": 1,
                            "evaluation_index": 1,
                            "student_index": 1,
                            "evaluation": {
                                "id": 8,
                                "value" : "meets"
                            },
                            "file": null
                        }
                    ]
                },
                {
                    "id": 2,
                    "portfolio_slo_id": 1,
                    "index": 2,
                    "name": "_unset_",
                    "evaluations": [
                        {
                            "id": 6,
                            "artifact_id": 2,
                            "evaluation_index": 1,
                            "student_index": 1,
                            "evaluation": {
                                "id": 7,
                                "value" : "exceeds"
                            },
                            "file": null
                        }
                    ]
                },
                {
                    "id": 3,
                    "portfolio_slo_id": 1,
                    "index": 3,
                    "name": "_unset_",
                    "evaluations": [
                        {
                            "id": 11,
                            "artifact_id": 3,
                            "evaluation_index": 1,
                            "student_index": 1,
                            "evaluation": {
                                "id": 9,
                                "value" : "partially"
                            },
                            "file": null
                        }
                    ]
                }
            ]
        }
    ]
};


describe('User Story 13: Display the date a course portfolio becomes read only', () => {

    describe('Task 1 - Assign Read Only Date to each course portfolio)', () => {

        // this is ran after each unit test
        afterEach(() => {
            // this is needed to restore the CoursePortfolio model back to it's original state
            // we don't want to break all future unit tests
            sandbox.restore()
        })

        it('assigns date', async () => {
            //Arrange
            var callback = sandbox.stub(course_portfolio, "get");
            callback.withArgs(1).returns(course_input);

            //Act
            const portfolio = await course_portfolio.get(1);
            var output = create.summarize(portfolio);

            //Assert
            expect(output).to.deep.equal({
                'archivedAt': 2022
            });
        })

        it('grab date from Database for display', async () => {
            //Arrange
            var new_course_input = JSON.parse(JSON.stringify(course_input));
            delete new_course_input.instructor.instructor_name;

            var callback = sandbox.stub(course_portfolio, "get");
            callback.withArgs(1).returns(new_course_input);

            //Act
            const portfolio = await course_portfolio.get(1);
            var output = create.summarize(portfolio);

            //Assert
            expect(output).to.deep.equal({
                'archivedAt': 2022
            });

        })
        })
})

