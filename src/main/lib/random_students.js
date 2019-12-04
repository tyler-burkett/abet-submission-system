'use strict';
const evaluation = require('../lib/evaluate_num_students')

// returns an array of students that need to be generated for the artifact
function random_students(total_num_students){
    // fill total group with the total number of students to represent all of the students in the class
    var total_group = [];
    for(var i = 0; i < total_num_students; i++){
        total_group[i] = i;
    }

    // Start Fisher-Yates (aka Knuth) shuffle
    var currentIndex = total_group.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = total_group[currentIndex];
      total_group[currentIndex] = total_group[randomIndex];
      total_group[randomIndex] = temporaryValue;
    } // End shuffle

    // get number of students to pick from total
    var total_to_pick = evaluation.evaluate_num_students(total_num_students);

    // grabs the first total_to_pick elements from the shuffled array
    var total_picked = []; 
    for(var k = 0; k < total_to_pick; k++){
        total_picked[k] = total_group[k];
    }

    if(total_picked.length > 1)
        return total_picked.sort((a, b) => {return a-b}); // returns the array sorted in ascending order
    else
        return total_picked; 
}


//express download function
module.exports = {random_students};