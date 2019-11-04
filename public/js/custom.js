
$(document).ready(function(){
    // Custom JQuery goes here...
    $('[data-toggle="tooltip"]').tooltip();

    var date = document.getElementsByClassName("due_date");
    var i;
    var today = new Date;
    for(i = 0; i < date.length; i++){
        var testing_date = new Date(date[i].innerHTML);
        if(testing_date < today){
            $('.active_courses tr:nth-child('+i+2+') .due_date').parent().insertAfter('.archived_courses tr:first-child');
        }
    }
    
});