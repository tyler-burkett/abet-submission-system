var express = require('express');
var mustache = require('../common/mustache')
var html = require('../common/html')
var course_portfolio_lib = require('../lib/course_portfolio')
var router = express.Router();

const Department = require('../models/Department')
const TermType = require('../models/TermType')

const { body, validationResult, sanitizeParam} = require('express-validator');

const course_manage_page = async (res, course_id) => {
	let course_info = {
		student_learning_outcomes: [
			{
				index: 1,
				description: 'n/a',
				metrics: [
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
					{
						name: 'n/a',
						exceeds: 'n/a',
						meets: 'n/a',
						partially: 'n/a',
						not: 'n/a'
					},
				],
				artifacts: [
					{
						name: 'n/a',
						evaluations: [
							{
								index: 1,
								evaluation: [
									{
										metric: 1,
										value: 6
									},
									{
										metric: 2,
										value: 6
									},
									{
										metric: 3,
										value: 6
									},
									{
										metric: 4,
										value: 6
									}
								]
							}
						]
					}
				]
			}
		]
	};

	res.render('base_template', {
		title: 'CS498 Course Portfolio',
		body: mustache.render('course/manage', course_info)
	})
}

const course_new_page = async (res, department = false) => {
	const departments = await Department.query().select()
	const semesters = await (await TermType.query()
		.findById('semester'))
		.$relatedQuery('terms')
	let student_learning_outcomes = false

	if (department) {
		student_learning_outcomes = await (await Department.query().findById(department))
			.$relatedQuery('student_learning_outcomes')
	}

	res.render('base_template', {
		title: 'New Course Portfolio',
		body: mustache.render('course/new', {
			departments,
			department,
			student_learning_outcomes,
			semesters
		})
	})
}

/* GET course home page */
router.route('/')
	.get(html.auth_wrapper(async (req, res, next) => {
		res.render('base_template', {
			title: 'Course Portfolios',
			body: mustache.render('course/index')
		})
	}))

/* Handlers which perform the expected actions of the request */
var course_page_handler = {
		'get': async (req, res, next) => {

			// check for sanitation errors; 
			// respond with Unprocessable Entity code (422) if errors occured
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() })
			}
	
			// process request for course page
			if (req.params.id === 'new') {
				await course_new_page(res)
			} else {
				await course_manage_page(res, req.params.id)
			}
		},
		'post': async (req, res, next) => {
			// check for sanitation errors; 
			// respond with Unprocessable Entity code (422) if errors occured
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() })
			}
	
			// process post request
			if (req.params.id === 'new') {
				if (req.body.course_submit) {
					const course_portfolio = await course_portfolio_lib.new({
						department_id: req.body.department,
						course_number: req.body.course_number,
						instructor: 1,
						semester: req.body.semester,
						year: req.body.course_year,
						num_students: req.body.num_students,
						student_learning_outcomes: Object.entries(req.body)
							.filter(entry => entry[0].startsWith('slo_') && entry[1] === 'on')
							.map(entry => entry[0].split('_')[1]),
						section: req.body.course_section
					})
	
					res.redirect(302, `/course/${course_portfolio.id}`)
				} else {
					await course_new_page(res, req.body.department)
				}
			} else {
				await course_manage_page(res, 499)
			}
		}
	};

/* GET course page */
router.route('/:id')
	.get(
		// id sanitizer
		sanitizeParam('id').customSanitizer((value) => {
			return value === 'new' ? 'new' : Number(value); 
		}), 

		// request handler 
		html.auth_wrapper((req, res, next) => {
			course_page_handler.get(req, res, next);
	}))
	.post(
		// id sanitizer
		sanitizeParam('id').customSanitizer((value) => {
			return value === 'new' ? 'new' : Number(value); 
		}), 

		// body section validators 
		body('department').isInt(),
		body('course_number').isInt(),
		body('semester').isInt(),
		body('course_year').isInt(),
		body('num_students').isInt(),
		body('course_section').isInt(),

		// custom sanitizer for entries that start with 'slo_'
		async (req, res, next) => {
			for (entry of Object.entries(req.body).filter(entry => entry[0].startsWith('slo_')) ){
				await body(entry[0]).isString().trim().escape().run(req);
			}

			const errors = validationResult(req);
			if (errors.isEmpty()) {
				return next();
			}

    		res.status(422).json({ errors: errors.array() });
		},

		// request handler
		html.auth_wrapper((req, res, next) => {
			course_page_handler.post(req, res, next);
	}))

module.exports = { router, course_page_handler};
