/*

Gets a list of professor names from https://online.umaine.edu/course-search or any umane course search page

*/

"use strict";

getProfNamesFromUMaine();

function getProfNamesFromUMaine(){
    var collegeName = "Maine";
    console.log("UMaine Course Search")
    var listOfNames = document.getElementsByClassName("classAttributeLeftHalf instructorList");

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

                    console.log(professorName);
                    var nameTag = listOfNames[i].getElementsByTagName('a')[j];           
                    var splitName = professorName.split(" ");

                    //use rating from localStorage if possible to reduce the number of calls to CORS Proxy/RMP
                    searchIfNeeded(splitName,nameTag,collegeName); 
                    
                    }

                }
            }
            }catch(err){
                console.error(err);
            }
        }
    }
}