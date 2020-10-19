
/*

Gets a list of professor names from https://usm.maine.edu/courses

*/

"use strict";

getProfNamesFromUSM();

function getProfNamesFromUSM(){
    console.log("USM Course Search")

var listOfNames = document.getElementsByClassName("instructor-link section-item");
var collegeName = "University+of+Southern+Maine"
var profName = document.querySelector("#content-area > div > div > article > div.profile-name-title-container > h2");

if(listOfNames.length > 0){
for(var i =0; i < listOfNames.length; i++){
    try{
            for(var j = 0; j < listOfNames[i].getElementsByTagName('a').length; j++){
                var professorName = listOfNames[i].getElementsByTagName('a')[j].innerHTML;
                var nameTag = listOfNames[i].getElementsByTagName('a')[j];
                var splitName = professorName.split(" ");
                 //use rating from localStorage if possible to reduce the number of calls to CORS Proxy/RMP
                getAndDisplayData(splitName,nameTag,collegeName); 
            }
    }catch(err){
        console.error("No professor exists for this class");
    }
}//for loop
}else{
    getSingleUSMProfName(profName,collegeName);
}


}


function getSingleUSMProfName(profName,collegeName){
     var splitName = profName.innerHTML.split(" ");

      var firstName = nickNameToFull(splitName[0]);
      if(firstName !== null){
          splitName[0] = firstName;
      }
      splitName = removeTitlesFromName(splitName);
      
      //use rating from localStorage if possible to reduce the number of calls to CORS Proxy/RMP
      var insertAfter = document.querySelector("#content-area > div > div > article > div.profile-name-title-container > div");
      getAndDisplayData(splitName,insertAfter,collegeName);


}


function getAndDisplayData(splitName,tag,collegeName){

    var rating = "";
    if(!localStorage[splitName[0] + " " + splitName[splitName.length - 1]]){
        getProfRating(splitName[0],splitName[splitName.length - 1],collegeName,tag);
    }else{
        rating = localStorage[splitName[0] + " " + splitName[splitName.length - 1]];
        tag.insertAdjacentHTML('afterend', '<p class="rmp-rating">' + rating + '</p>');
    }
}
