const { expect } = require('../../chai')
const sinon = require('sinon')
const course_portfolio = require('../../../main/lib/course_portfolio')
const display = require('../../../main/lib/course_portfolio_display')
const dateformat = require('dateformat')


// we use a sandbox so that we can easily restore all stubs created in that sandbox
const sandbox = sinon.createSandbox();



describe('Epic User Story 3 - Archived and Active Course Seperation', () => {

    describe('Task 2 - Differentiate archived courses from active ones', () => {

        // this is ran after each unit test
        afterEach(() => {
            // this is needed to restore any states changed by tests back to there original states
            // we don't want to break all future unit tests
            sandbox.restore()
        })

        it('Determines if portfolio is archived based on due date, formatted as mm/dd/yyyy', () => {

            debugger
            // Arrange
            var due_date_archived = dateformat(new Date('December 19, 2018'), "mm/dd/yyyy");
            var current_date = dateformat(new Date('December 18, 2018'), "mm/dd/yyyy");
            var due_date_active = dateformat(new Date('December 17, 2018'), "mm/dd/yyyy");
            
            // Act 
            var archive_results = [display.is_archived(due_date_archived, current_date), display.is_archived(due_date_active, current_date)];

            // Assert
            expect(archive_results[0]).to.be.true;
            expect(archive_results[1]).to.be.false;

        })

    })

        

    describe('Task 3 - Summarize course portfolio for display', () => {

        // this is ran after each unit test
        afterEach(() => {
            // this is needed to restore any states changed by tests back to there original states
            // we don't want to break all future unit tests
            sandbox.restore()
        })

        it('Summarizes course portfolio', async () => {

            // Arrange

            // sample input for course portfolio
            var course_input = {
                "id": 1,
                "course_id": 1,
                "instructor_id": 1,
                "semester_term_id": 1,
                "num_students": 5,
                "section": 1,
                "year": 2019,
                "due_date" : "12/25/2019",
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
                                            "id": 5,
                                            "value" : "n/a"
                                        },
                                        "file": null
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            var callback = sandbox.stub(course_portfolio, "get");
            callback.withArgs(1).returns(course_input);

            debugger
            // Act
            const portfolio = await course_portfolio.get(1);
            var summary = display.summarize(portfolio);

            // Assert
            expect(summary).to.deep.equal({
                "name" : "CS498",
                "semester" : "fall",
                "year" : 2019,
                "artifact_completed" : 2,
                "artifact_total": 3,
                "due_date" : "12/25/2019"
            })
        })

    })

})