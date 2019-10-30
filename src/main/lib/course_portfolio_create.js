'use strict';

const PDFDocument = require('pdfkit');
var fs = require('fs');

function summarize(course_portfolio) {
    
    var summary = {};

    // get name (null if name not present)
    if(!course_portfolio.course.hasOwnProperty('course_name'))
        summary['course_name'] = null;
    else
        summary['course_name'] = course_portfolio.course.course_name;
    
    // get course number (department abbreviation + course number)
    summary['course_number'] = course_portfolio.course.department.identifier.toUpperCase() + 
                               String(course_portfolio.course.number);

    // get intsructor name (or link blue id if not present)
    if (!course_portfolio.instrcutor.hasOwnProperty('instructor_name'))
        summary['instructor_name'] = course_portfolio.instrcutor.linkblue_username;
    else 
        summary['instructor_name'] = course_portfolio.instrcutor.instructor_name;
    
    // get section
    summary['section'] = course_portfolio.section;

    // get semester
    summary['semester'] = course_portfolio.semester.value;

    // get year
    summary['year'] = course_portfolio.year;

    //get number of students 
    summary['num_students'] = course_portfolio.num_students;

    //Calculate scores

    //Artifact scores (% meet or exceed for an artifact)
    var artifact_scores = {};
    for (var outcome in course_portfolio.outcomes) {
        for (var artifact in outcome.artifacts) {
            if (artifact_scores.hasOwnProperty(String(artifact.id)))
                continue;
            var num_exceed_meet = 0;
            var total = 0;
            for (var eval in artifact.evaluations) {
                if (eval.evaluation.value == 'meets' || eval.evaluation.value == 'exceeds')
                    num_exceed_meet += 1;
                total++;
            }
            artifact_scores[String(artifact.id)] = { 'score' : num_exceed_meet / total, 
                                                     'portfolio_slo_id' : artifact.portfolio_slo_id };
        }
    }

    summary['artifact_scores'] = artifact_scores;

    //SLO scores (average of artifacts)
    var slo_scores = [];
    for (var outcome in course_portfolio.outcomes) {
        var sum = 0;
        var total = 0;
        var current_slo_id = outcome.slo_id;
        for (var artifact_id in artifact_scores) {
            if (artifact_scores[artifact_id].portfolio_slo_id == current_slo_id) {
                sum += artifact_scores[artifact_id].score;
                total++;
            }
        }
        var avg = sum / total;
        slo_scores.push({'slo_description': outcome.slo.description, 'slo_score': avg});
    }

    summary['slo_scores'] = slo_scores;

    //course score (average of SLO scores)
    var sum = 0;
    var total = 0;
    for (var slo in slo_scores) {
        sum += slo.slo_score;
        total++;
    }
    summary['course_score'] = sum / total;

    summary['student_evals'] = course_portfolio.outcomes;

    return summary;
} 

function create_course_summary_PDF(course_summary, directory) {

    /*
    expect object with the following members:
    */
    var members = ['course_name',
        'course_number',
        'instructor_name',
        'section',
        'semester',
        'year',
        'num_students',
        'course_score',
        'slo_scores',
        'artifact_scores',
        'student_evals'
    ];

    // Verify object has all the needed properties
    // and propertie values are valid
    /*
    for (var name in members) {
        if (course_summary.hasOwnProperty(name)) {
            if (course_summary[name] == null || course_summary[name] == undefined) {
                throw Error('Invalid value for property' + name);
            }
        }
        else {
            throw Error('Neccessary property' + name + 'missing');
        }
    }
    */

    // Create PDF
    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream(directory + '/course_summary.pdf'));

    // Create Title
    doc.font('fonts/PalatinoBold.ttf')
        .fontSize(25)
        .text('Course Summary');

    // Fill in PDF with data from course summary
    for (var name in members) {
        doc.font('fonts/PalatinoBold.ttf')
        .fontSize(12)
        .text(name + ': ' + String(course_summary[name]));
    }

    // close the PDF document to save changes
    doc.end();

    // PDF is made at this point, so indicate success
    return true;
}

function create_SLO_PDFs(artifacts_and_evals, directory) {

    /* 
    expect array of SLO artifact objects with the following members:
    artifact_index
    artifact_name
    is_group_assignment
    number_of_submissions
    evaluations (array)
        eval_index
        student_index
        evaluation
        file
    */

    var artifact_members = [
        'slo_index',
        'slo_description',
        'artifact_index',
        'artifact_name',
        'is_group_assignment',
        'number_of_submissions',
        'evaluations'
    ];
    var evaluation_members = [
        'eval_index',
        'student_index',
        'evaluation',
        'file'
    ];

    // Verify object has all the needed properties
    // and propertie values are valid
    /*
    for (var object in artifacts_and_evals)
        for (var name in artifact_members) {
            if (object.hasOwnProperty(name)) {
                if (course_summary[name] == null || course_summary[name] == undefined) {
                    throw Error('Invalid value for property' + name);
                }
            }
            else {
                throw Error('Neccessary property' + name + 'missing');   
            }
        }
        if(eval.length != object.number_of_submissions) {
            throw Error('Mismatch between number of evaluations and number indicated');
        }
        for(var eval in object.evaluations) {
            for (var name in evaluation_members) {
                if (!(eval.hasOwnProperty(name))) {
                    if (course_summary[name] == null || course_summary[name] == undefined) {
                        throw Error('Invalid value for property' + name + 'in an evaluation');
                    }
                }
                else {
                    throw Error('Neccessary property' + name + 'missing in an evaluation');   
                }
            }
        }
        */

    for (var artifact in artifacts_and_evals) {
        for(var eval in artifact.evaluations) {
            // Create PDF
            const doc = new PDFDocument;
            doc.pipe(fs.createWriteStream(directory + '/slo_' + String(artifact.slo_index) + 
                                        '/artifact_' + String(artifact.artifact_index) + 
                                        '/student_eval_' + String(eval.eval_index) + '_' + String(eval.student_index) + '.pdf'));

            // Create Title
            doc.font('fonts/PalatinoBold.ttf')
                .fontSize(25)
                .text('Student Evaluation');

            // Fill in PDF with data from artifact
            for (var name in artifact_members.slice(0,4)) {
                doc.font('fonts/PalatinoBold.ttf')
                .fontSize(12)
                .text(name + ': ' + String(artifact[name]));
            }

            // Fill in PDF with data from evaluation
            for (var name in evaluation_members.slice(0,3)) {
                doc.font('fonts/PalatinoBold.ttf')
                .fontSize(12)
                .text(name + ': ' + String(eval[name]));
            }

            //TODO: how to attach pdf? how is pdf specified via object (path, raw data) ?

            // close the PDF document to save changes
            doc.end();
        }
    }

    // PDF is made at this point, so indicate success
    return true;
}

//express download function
    module.exports = {summarize, create_course_summary_PDF, create_SLO_PDFs};