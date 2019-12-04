'use strict';

const PDFDocument = require('pdfkit');
var fs = require('fs');
var zipper = require('zip-local');

var zipper = require('zip-local');

function generateZip(evals, directory){
    var generate_pdfs = printStudentEvals(evals, directory);
    if(!generate_pdfs){
        return false;
    }
    zipper.sync.zip(directory).compress().save("course_evaluation.zip", function(error) {
        if(error) {
            return false;
        }
    });
    return true;
}


function printStudentEvals(evals, directory){
    var artifacts= evals['artifacts'];
    
    for (var artifact of artifacts){
        for (var evaluation of artifact['evaluations']){
            

   var components = [
    'id',
    'artifact_id',
    'evaluation_index',
    'student_index',
    'evaluations',
    'file'
];
   // Create PDF
   const doc = new PDFDocument;
  var direct = directory;
   if (!fs.existsSync(directory)){
       fs.mkdirSync(directory);
   }
   var path = direct + '/student_eval_1.pdf';
   var writeStream = fs.createWriteStream(path, {'mode': 0o777});
   doc.pipe(writeStream);
   
   // Create Title
   doc.font('Times-Roman')
       .fontSize(25)
       .text('Student Evaluation ' + String(evaluation['id']));

   // Fill in PDF with data from course summary
   for (var name in components) {
       if (evaluation[name] != null){
       doc.font('Times-Roman')
       .fontSize(12)
       .text(name + ': ' + String(evaluation[name]));
       } else {
        doc.font('Times-Roman')
        .fontSize(12)
        .text(name + ': null');
       }
   }

   // close the PDF document to save changes
   doc.end();
    }
}
   // PDFs are made at this point, so indicate success
   return true;
}

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
    if (!course_portfolio.instructor.hasOwnProperty('instructor_name'))
        summary['instructor_name'] = course_portfolio.instructor.linkblue_username;
    else 
        summary['instructor_name'] = course_portfolio.instructor.instructor_name;
    
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
    var artifact_scores = [];
    for (var outcome in course_portfolio.outcomes) {
        var outcomes = course_portfolio.outcomes;
        for (var artifact in outcomes[outcome].artifacts) {
            var artifacts = outcomes[outcome].artifacts;
            if (artifact_scores.hasOwnProperty(String(artifacts[artifact].id)))
                continue;
            var num_exceed_meet = 0;
            var total = 0;
            for (var student_eval in artifacts[artifact].evaluations) {
                var evaluations = artifacts[artifact].evaluations
                if (evaluations[student_eval].evaluation.value == 'meets' || evaluations[student_eval].evaluation.value == 'exceeds')
                    num_exceed_meet += 1;
                total++;
            }
            artifact_scores.push({
                                'artifact_id': artifacts[artifact].id,
                                'score' : parseFloat((num_exceed_meet / total).toFixed(2)), 
                                'portfolio_slo_id' : artifacts[artifact].portfolio_slo_id 
                            });
        }
    }

    summary['artifact_scores'] = artifact_scores;

    //SLO scores (average of artifacts)
    var slo_scores = [];
    for (var outcome in course_portfolio.outcomes) {
        var sum = 0;
        var total = 0;
        var current_slo_id = course_portfolio.outcomes[outcome].slo_id;
        for (var artifact_id in artifact_scores) {
            if (artifact_scores[artifact_id].portfolio_slo_id == current_slo_id) {
                sum += artifact_scores[artifact_id].score;
                total++;
            }
        }
        var avg = parseFloat((sum / total).toFixed(2));
        slo_scores.push({'slo_description': course_portfolio.outcomes[outcome].slo.description, 'slo_score': avg});
    }

    summary['slo_scores'] = slo_scores;

    //course score (average of SLO scores)
    var sum = 0;
    var total = 0;
    for (var slo in slo_scores) {
        sum += slo_scores[slo].slo_score;
        total++;
    }
    summary['course_score'] = parseFloat((sum / total).toFixed(2));

    summary['student_evals'] = course_portfolio.outcomes;

//    summary['archivedAt'] = course_portfolio.archivedAt;
    return summary;
} 

function create_course_summary_PDF(course_summary, directory) {

    /*
    expect object with the following members:
    */
    var members = [
        'course_name',
        'course_number',
        'instructor_name',
        'section',
        'semester',
        'year',
        'num_students',
        'course_score',
        'slo_scores',
        'artifact_scores',
        'student_evals',
        'archivedAt'
    ];

    //check if summary is valid
    for(var member_index in members) {
        var member_name = members[member_index];
        if(!course_summary.hasOwnProperty(member_name)) {
            throw Error;
        }
    }

    // Create PDF
    const doc = new PDFDocument;
    
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory);
    }
    var writeStream = fs.createWriteStream(directory + '/course_summary.pdf', {'mode': 0o777});
    doc.pipe(writeStream);

    // Create Title
    doc.font('Times-Roman')
        .fontSize(25)
        .text('Course Summary');

    // Fill in PDF with data from course summary
    for (var name in members) {
        doc.font('Times-Roman')
        .fontSize(12)
        .text(name + ': ' + String(course_summary[name]));
    }

    // close the PDF document to save changes
    doc.end();

    // PDF is made at this point, so indicate success
    return true;
}

//express download function
    module.exports = {printStudentEvals, generateZip, summarize, create_course_summary_PDF};
