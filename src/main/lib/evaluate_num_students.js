'use strict';

// returns the number of students that need to be generated for the artifact
function evaluate_num_students(num_students){
    if(num_students < 10)
        return (num_students / 10) * 2; // min 20%
    else // greater than 10
        return 10;  // max 10      
}


//express download function
module.exports = {evaluate_num_students};
