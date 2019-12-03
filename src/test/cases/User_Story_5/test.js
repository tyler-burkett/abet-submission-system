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

    // describe('Course Name and Instructor Name are Returned Correctly', () => {

    //     // this is ran after each unit test
	// 	afterEach(() => {
	// 		// this is needed to restore the CoursePortfolio model back to it's original state
	// 		// we don't want to break all future unit tests
	// 		sandbox.restore()
    //     })
    //     it('returns instructor name when queried', async () => {
    //         //Arrange
    //         var new_course_input = JSON.parse(JSON.stringify(course_input));
    //         //delete new_course_input.instructor.instructor_name;
            
    //         var callback = sandbox.stub(course_portfolio, "get");
    //         callback.withArgs(1).returns(new_course_input);

    //         //Act
    //         const portfolio = await course_portfolio.get(1);
    //         var output = create.get_instructor_name(portfolio);
            
    //         //Assert
    //         expect(output).to.deep.equal('Ethan Toney');

    //     })
    //     it('returns course name when queried', async () => {
    //         //Arrange
    //         var new_course_input = JSON.parse(JSON.stringify(course_input));
    //         //delete new_course_input.instructor.instructor_name;
            
    //         var callback = sandbox.stub(course_portfolio, "get");
    //         callback.withArgs(1).returns(new_course_input);

    //         //Act
    //         const portfolio = await course_portfolio.get(1);
    //         var output = create.get_course_name(portfolio);
            
    //         //Assert
    //         expect(output).to.deep.equal('Software Engineering for Senior Project');

    //     })

    // })

    describe('Task 2 - summarize course portfolio (function summarize)', () => {

        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
			sandbox.restore()
        })
        
        it('summarizes course', async () => {
            //Arrange

            var callback = sandbox.stub(course_portfolio, "get");
            callback.withArgs(1).returns(course_input);

            //Act
            const portfolio = await course_portfolio.get(1);
            var output = create.summarize(portfolio);
            
            //Assert
            expect(output).to.deep.equal({
                'course_name': 'Software Engineering for Senior Project',
                'course_number': 'CS498',
                'instructor_name': 'Ethan Toney',
                'section': 1,
                'semester': 'fall',
                'year': 2019,
                'num_students' : 5,
                'course_score': 0.67,
                'slo_scores': [
                {
                    'slo_description': "Design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program's discipline.",
                    'slo_score': 0.67
                }],
                'artifact_scores': [
                {
                    'artifact_id': 1,
                    'score' : 1, 
                    'portfolio_slo_id' : 1 
                }, 
                {
                    'artifact_id': 2,
                    'score' : 1, 
                    'portfolio_slo_id' : 1 
                }, 
                {
                    'artifact_id': 3,
                    'score' : 0, 
                    'portfolio_slo_id' : 1 
                }],
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
            });

        })

        it('uses linkblue ID if instructor name not found', async () => {
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
                'course_name': 'Software Engineering for Senior Project',
                'course_number': 'CS498',
                'instructor_name': 'ethan.toney',
                'section': 1,
                'semester': 'fall',
                'year': 2019,
                'num_students' : 5,
                'course_score': 0.67,
                'slo_scores': [
                {
                    'slo_description': "Design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program's discipline.",
                    'slo_score': 0.67
                }],
                'artifact_scores': [
                {
                    'artifact_id': 1,
                    'score' : 1, 
                    'portfolio_slo_id' : 1 
                }, 
                {
                    'artifact_id': 2,
                    'score' : 1, 
                    'portfolio_slo_id' : 1 
                }, 
                {
                    'artifact_id': 3,
                    'score' : 0, 
                    'portfolio_slo_id' : 1 
                }],
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
            });

        })


        it('leaves null if course name not found', async () => {
            //Arrange
            var new_course_input =JSON.parse(JSON.stringify(course_input));
            delete new_course_input.course.course_name;

			var callback = sandbox.stub(course_portfolio, "get");
            callback.withArgs(1).returns(new_course_input);

            //Act
            const portfolio = await course_portfolio.get(1);
            var output = create.summarize(portfolio);
            
            //Assert
            expect(output).to.deep.equal({
                'course_name': null,
                'course_number': 'CS498',
                'instructor_name': 'Ethan Toney',
                'section': 1,
                'semester': 'fall',
                'year': 2019,
                'num_students' : 5,
                'course_score': 0.67,
                'slo_scores': [
                {
                    'slo_description': "Design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program's discipline.",
                    'slo_score': 0.67
                }],
                'artifact_scores': [
                {
                    'artifact_id': 1,
                    'score' : 1, 
                    'portfolio_slo_id' : 1 
                }, 
                {
                    'artifact_id': 2,
                    'score' : 1, 
                    'portfolio_slo_id' : 1 
                }, 
                {
                    'artifact_id': 3,
                    'score' : 0, 
                    'portfolio_slo_id' : 1 
                }],
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
            });

        })

    })

    describe('Task 3 - create course summary pdf (create_course_summary_PDF)', () => {
        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
            sandbox.restore();
        })

        it('creates course summary PDF', () => {
            //Arrange
            var summary = {
                'course_name': 'Software Engineering for Senior Project',
                'course_number': 'CS498',
                'instructor_name': 'Ethan Toney',
                'section': 1,
                'semester': 'fall',
                'year': 2019,
                'num_students' : 5,
                'course_score': 0.66,
                'slo_scores': [
                {
                    'slo_description': "Design, implement, and evaluate a computing-based solution to meet a given set of computing requirements in the context of the program's discipline.",
                    'slo_score': 0.66
                }],
                'artifact_scores': [
                {
                    'artifact_id': 1,
                    'score' : 1, 
                    'portfolio_slo_id' : 1 
                }, 
                {
                    'artifact_id': 2,
                    'score' : 1, 
                    'portfolio_slo_id' : 1 
                }, 
                {
                    'artifact_id': 3,
                    'score' : 0, 
                    'portfolio_slo_id' : 1 
                }],
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
            var directory = __dirname + '/tmp';

            //Act
            var pdf_made = create.create_course_summary_PDF(summary, directory);
            
            //Assert
            expect(pdf_made).to.be.true;
            expect(fs.existsSync(directory + '/course_summary.pdf')).to.be.true;
    
            //Clean up (done only for this test)
            fs.removeSync(directory);
        })

        it('throws error on invalid summary', () => {
            //Arrange
            var summary = {};
            var directory = __dirname + '/tmp';
            //Act
            //Assert
            expect(() => {return create.create_course_summary_PDF(summary, directory)}).to.throw();
            expect(fs.existsSync(directory + '/course_summary.pdf')).to.be.false;
        })

    })
    describe('Task 4 - generate pdfs for student evaluations', () => {
        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
            sandbox.restore();
        })

        it('creates PDFs formatted as specified in the requirements document', () => {
            //Arrange
            var student_evals = {
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
                };

            //Act
            var directory = __dirname + '/artifact_1';
            var pdf_made = create.printStudentEvals(student_evals, directory);
            
            //Assert
            expect(pdf_made).to.be.true;
    
        })

    })
    describe('Task 5 - generate zip file', () => {
        // this is ran after each unit test
		afterEach(() => {
			// this is needed to restore the CoursePortfolio model back to it's original state
			// we don't want to break all future unit tests
            sandbox.restore();
        })
        it('creates directory structures as specified in the requirements document', () => {
            //Arrange
            var student_evals = {
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
                                    "evaluations": {
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
                };
            var directory = __dirname + '/artifact_1';

            //Act
            create.printStudentEvals(student_evals, directory);
            
            //Assert
            expect(fs.existsSync(directory + '/student_eval_1.pdf')).to.be.true;
    
            //Clean up (done only for this test)
            fs.removeSync(directory);
        })
        it('creates the zip file', () => {
            //Arrange
            var student_evals = {
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
                };

            //Act
            var directory = __dirname + '/artifact_1';
            var zip_bool = create.generateZip(student_evals, directory);
            
            //Assert
            expect(zip_bool).to.be.true;
    
        })

    })
})