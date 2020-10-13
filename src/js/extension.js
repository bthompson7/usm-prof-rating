
/*

Author: Ben Thompson
Description: 

This script/extension is activated on https://usm.maine.edu/courses*. 
It looks up the RateMyProfessor rating for each professor on the page and then displays it on the page
so that people don't have to keep switching tabs.


Extension TODOs:

Short Term:
-Bug fixes for weird edge cases or anything else

var myurl = "https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q=";
https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q=David+Briggs+University+of+Southern+Maine

Long Term:
-Add support for Mainestreet class searching
-Add Support for prof. pages like https://usm.maine.edu/eng/mike-bendzela
-

*/


var win = window.location.href;


if(win.indexOf("https://online.umaine.edu") > -1){
    getProfNamesFromUMaine();
}else{
    getProfNamesFromUSM();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

/*
Gets a list of professor names from https://online.umaine.edu/course-search 
*/

function getProfNamesFromUMaine(){
    console.log("UMaine Course Search")
    var listOfNames = document.getElementsByClassName("classAttributeLeftHalf instructorList");
for(var i =0; i < listOfNames.length; i++){
    try{
        var collegeName = "Maine";
        var name = listOfNames[i].getElementsByTagName('a')[0].innerHTML;
        var nameTag = listOfNames[i].getElementsByTagName('a')[0];
        var rating = "";
        var res = name.split(" ");
    //use rating from localStorage if possible to reduce the number of calls to RMP
    if(res.length == 2 && !localStorage[res[0] + " " + res[1]]){
        getProfRating(res[0],res[1],collegeName,nameTag);
    }else if(res.length == 2 && localStorage[res[0] + " " + res[1]]){
        rating = localStorage[res[0] + " " + res[1]];
        nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + rating +  '</div>');
    }else if(res.length == 3 && !localStorage[res[0] + " " + res[2]]){
        getProfRating(res[0],res[2],collegeName,nameTag);
    }else if(res.length == 3 && localStorage[res[0] + " " + res[2]]){
        rating = localStorage[res[0] + " " + res[2]];
        nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + rating +  '</div>');

    }

    }catch(err){
        console.error(err + "No professor exists for this class");
    }
}

}

/*
Gets a list of professor names from https://usm.maine.edu/courses
*/

function getProfNamesFromUSM(){
    console.log("USM Course Search")

var listOfNames = document.getElementsByClassName("instructor-link section-item");

for(var i =0; i < listOfNames.length; i++){
    try{
        var collegeName = "University+of+Southern+Maine"
        var name = listOfNames[i].getElementsByTagName('a')[0].innerHTML;
        var nameTag = listOfNames[i].getElementsByTagName('a')[0];
        var rating = "";
        var res = name.split(" ");

    //use rating from localStorage if possible to reduce the number of calls to RMP
    if(res.length == 2 && !localStorage[res[0] + " " + res[1]]){
        getProfRating(res[0],res[1],collegeName,nameTag);
    }else if(res.length == 2 && localStorage[res[0] + " " + res[1]]){
        rating = localStorage[res[0] + " " + res[1]];
        nameTag.insertAdjacentHTML('afterend', '<p class="rmp-rating">' + rating + '</p>');
    }else if(res.length == 3 && !localStorage[res[0] + " " + res[2]]){
        getProfRating(res[0],res[2],collegeName,nameTag);
            }else if(res.length == 3 && localStorage[res[0] + " " + res[2]]){
        rating = localStorage[res[0] + " " + res[2]];
        nameTag.insertAdjacentHTML('afterend', '<p class="rmp-rating">' + rating + '</p>');

    }

    }catch(err){
        console.error("No professor exists for this class");
    }
}
}
