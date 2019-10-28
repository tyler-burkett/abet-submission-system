'use strict';

const PDFDocument = require('pdfkit');
var fs = require('fs');

function summarize(course_portfolio) {
    //TODO
    return {};
} 

function create_course_summary_PDF(course_summary) {

    /*
    expect object with the following members:
    course_name
    course_number
    instructor_name
    section
    semester
    year
    number_students
    */
    var members = ['course_name',
        'course_number',
        'instructor_name',
        'section',
        'semester',
        'year',
        'number_students',
        'course_score',
        'slo_scores',
        'artifact_scores',
    ];

    // Verify object has all the needed properties
    // and propertie values are valid
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

    // Create PDF
    const doc = new PDFDocument;
    doc.pipe(fs.createWriteStream('tmp/course_portfolio/course_summary.pdf'));

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

function create_SLO_PDFs(artifacts_and_evals) {

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

    for (var artifact in artifacts_and_evals) {
        for(var eval in artifact.evaluations) {
            // Create PDF
            const doc = new PDFDocument;
            doc.pipe(fs.createWriteStream('tmp/course_portfolio/slo_' + String(artifact.slo_index) + 
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
    module.exports = {summarize, create_course_summary_PDF, create_SLO_PDFs};