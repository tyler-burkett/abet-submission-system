const dateformat = require('dateformat')

function summarize(course_portfolio) {
    var artifact_ids = [];
    var artifacts_sum = 0;
    var artifacts_complete = 0;

    // calculate artifact completion
    var num_students_per_artifact = 0;
    if(course_portfolio.num_students <= 10) {
        num_students_per_artifact = Math.trunc(.2 * course_portfolio.num_students);
    }
    else {
        num_students_per_artifact = Math.max(Math.trunc(.2 * course_portfolio.num_students), 10);
    }

    // go through each outcome
    for (outcome_index in course_portfolio.outcomes) {
        var outcome = course_portfolio.outcomes[outcome_index];

        // go through each artifact associted with an outcome
        for (artifact_index in outcome.artifacts) {
            var artifact = outcome.artifacts[artifact_index];
            var student_ids = [];
            var student_num = 0;

            // if the artifact id has not been seen before,
            // increment the number of artifacts seen and determine
            // if the artifact is completed
            if(!artifact_ids.includes(artifact.id)) {
                artifact_ids.push(artifact.id);
                artifacts_sum++;
                var student_has_eval = {};

                for (eval_index in artifact.evaluations) {
                    var eval = artifact.evaluations[eval_index];
                    if(!student_ids.includes(eval.student_index)) {
                        student_ids.push(eval.student_index);
                        student_num++;
                        student_has_eval[String(eval.student_index)] = false;
                    }
                    if(eval.evaluation.id > 6) {
                        student_has_eval[String(eval.student_index)] = true;
                    }
                }

                var has_entries_for_all_students = true;

                for (index in student_has_eval) {
                    if (student_has_eval[index] === false) {
                        has_entries_for_all_students = false
                    }
                }

                if (student_num >= num_students_per_artifact && has_entries_for_all_students) {
                    artifacts_complete++;
                }
            }
        }
    }

    debugger
    return {
        "name" : course_portfolio.course.department.identifier.toUpperCase() + course_portfolio.course.number.toString(10),
        "semester" : course_portfolio.semester.value,
        "year" : course_portfolio.year,
        "artifact_completed" : artifacts_complete,
        "artifact_total": artifacts_sum,
        "due_date" : course_portfolio.due_date
    }
}

function is_archived(due_date, current_date = dateformat(new Date(), "mm/dd/yyyy")) {
 
    // split date components and re-organize based on significance of date component 
    var due_date_parts = due_date.split('/');
    var current_date_parts = current_date.split('/');
    due_date_parts = [due_date_parts[2], due_date_parts[0], due_date_parts[1] ];
    current_date_parts = [current_date_parts[2], current_date_parts[0], current_date_parts[1] ];

    // loop through and compare dates components.
    for (var i = 0; i < 3; i++) {
        if(Number(due_date_parts[i]) > Number(current_date_parts[i])) {
            return true
        }
        if(Number(due_date_parts[i]) < Number(current_date_parts[i])) {
            return false
        }
    }

    // at this point, both dates must be equal; the portfolio is archived
    return true;
}

module.exports = {summarize, is_archived}