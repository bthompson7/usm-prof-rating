
/*
Gets a list of professor names from https://usm.maine.edu/courses
*/

"use strict";

getProfNamesFromUSM();

function getProfNamesFromUSM(){
    console.log("USM Course Search")



var listOfNames = document.getElementsByClassName("instructor-link section-item");

var collegeName = "University+of+Southern+Maine"

if(listOfNames.length > 0){
for(var i =0; i < listOfNames.length; i++){
    try{
            var numOfProfs = listOfNames[i].getElementsByTagName('a').length;
            
            if(numOfProfs == 1){
                for(var j = 0; j < numOfProfs; j++){
                    var professorName = listOfNames[i].getElementsByTagName('a')[j].innerHTML;
                    console.log(professorName);
                    var nameTag = listOfNames[i].getElementsByTagName('a')[j];           
                    var splitName = professorName.split(" ");
                    
                    //use rating from localStorage if possible to reduce the number of calls to CORS Proxy/RMP
                    searchIfNeeded(splitName,nameTag,collegeName); 
                }
            }else if(numOfProfs > 1){
                for(var j = 0; j <= numOfProfs; j++){
                    var professorName = listOfNames[i].getElementsByTagName('a')[j].innerHTML;

                    if(!professorName.includes("View Ratings on RateMyProfessors.com")){
                    var nameTag = listOfNames[i].getElementsByTagName('a')[j];           
                    var splitName = professorName.split(" ");
                    
                    //use rating from localStorage if possible to reduce the number of calls to CORS Proxy/RMP
                    searchIfNeeded(splitName,nameTag,collegeName); 
                    
                    }

                }
            }
           
    }catch(err){
        console.error(err.message);
    }
}//for loop
}else{
    var profName = document.querySelector("#content-area > div > div > article > div.profile-name-title-container > h2");
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
      searchIfNeeded(splitName,insertAfter,collegeName);


}

