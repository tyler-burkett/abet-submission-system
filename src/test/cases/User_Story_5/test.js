//const course_portfolio = require('../../../main/lib/course_portfolio')
var create = require('../../../main/lib/course_portfolio_create')
const { expect } = require('../../chai')
const sinon = require('sinon')

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


describe('Epic 5 - Download Course Portfolio', () => {

    describe('Task 2 - summarize course portfolio (function summarize)', () => {

        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
        })
        
        it('summarizes course', () => {
            //Arrange
            let course_input = {...course_input};

            //Act
            var output = create.summarize(course_input);
            
            //Assert
            expectoutputto.deep.equal({  
            });

        })

        it('uses linkblue ID if instructor name not found', () => {
            //Arrange
            let course_input = {...course_input};
            delete course_input.instructor_name;

            //Act
            var output = create.summarize(course_input);
            
            //Assert
            expectoutputto.deep.equal({  
            });

        })

        it('leaves null if course name not found', () => {
            //Arrange
            let course_input = {...course_input};
            delete course_input.course_name;

            //Act
            var output = create.summarize(course_input);
            
            //Assert
            expectoutputto.deep.equal({  
            });

        })

    })

    describe('Task 3 - create course summary pdf (create_course_summary_PDF)', () => {
        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
        })

        it('creates course summary PDF', () => {
            //Arrange
            var input = {
                'course_name': 'Software Engineering for Senior Project',
                'course_number': 'CS498',
                'instructor_name': 'Ethan Toney',
                'section': 1,
                'semester': 'fall',
                'year': 2019,
                'number_students' : 5,
                'course_score': 0.88,
                'slo_scores': [0.88],
                'artifact_scores': [0.88, 0.90, 0.73],
                'student_evals': [
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