/*

Contains useful functions that are shared between different scripts 

*/

"use strict";

const titles = ['PhD','Ph.D.','MSN','RN', 'APRN-BC','CPNP-PC',
'FNAP','MS','BS','AGACNP-BC','DNP','MSN','Chairman',
'Chairwoman','Chairperson','M.D.','CNE','BSN','DNSc,','M.S.',
'MS','M.A.','MA','RN-BC','MBA','NP-C','CCRN','AGPCNP-BC','APRN','PMH-NP',
'CHSOS','MPH','Chair','Dean','President','Associate Dean','V.M.D.','FAANP','FNP-BC'];

//Maps Nick Name => Full Name
let names = new Map();
names.set('Tim','Timothy');
names.set('Bob','Robert');


/*

Any courses where we can't find the professor using the 
firstname + lastname we will lookup the professor using the last name and
then checking if they match the current subject we are in.

This will get updated as I find them.

*/
let courses = new Map();
courses.set("BIO","Biology")
courses.set("CHY","Chemistry")

/*

Convert a full name to a nickname 


*/

function fullNameToNick(name){
    if(nickNames.get(name) !== undefined){
        return nickNames.get(name);
    }else{
        return null;
    }
}

/*

Lookup a course

*/
function getCourse(courseName){
    if(courses.get(courseName) !== undefined){
        return courses.get(courseName);
    }else{
        return null;
    }
}

/*

Get 1 week in unix time

*/
function getOneWeekInUnixTime(){
    return 518400;
}

/*

Get the current unix time

*/
function getCurrentUnixTime(){
    return Math.floor(Date.now() / 1000);
}

/*

Removes extra words/titles from a persons name

For example:
Shelton Waldrep, Chair => Shelton Waldrep
Brenda Petersen PhD, MSN, RN, APRN-BC, CPNP-PC => Brenda Petersen

*/

function removeTitlesFromName(profNameList){
for(var i = profNameList.length - 1; i > 0; i--){
    for(var j =0; j < titles.length; j++){
        var name = profNameList[i]

        if(name.includes(titles[j]) || name.includes(titles[j] + "," ||
         "," + name.includes(titles[j]) || "," + name.includes(titles[j]) + ",")){

            profNameList.pop();
            break;
        }
    }
}
return profNameList;
}


/*

Return the fullname based on the nickname given

*/

function nickNameToFull(name){
    if(names.get(name) !== undefined){
        return names.get(name);
    }else{
        return null;
    }
}


/*
Round the number to 1 decimal point

*/

function roundNumber(num){
    if(num === undefined){
        return null;
    }
    return Math.round(num * 10) / 10;


}



/*

Convert a json object into an html tag to display on the webpage

*/
function jsonToHTML(jsonObject){

  
    var ratingURL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid=";
    if(jsonObject['foundProf']){
      var avgProfRating = jsonObject['avgRating'];
  
      if(avgProfRating >= 3.4){
        return "<img src=" + chrome.extension.getURL('./assets/rmp-good.jpg') +
         "><br><b>Overall Rating: </b>" + jsonObject['avgRating'] + "/5 based on " + 
         jsonObject['totalRatings'] + " ratings. <br><b>Difficulty: </b>" + jsonObject['profHardness'] +
          "/5<br>" + "<a href=" + ratingURL + jsonObject['profID'] + " target='_blank' >View Ratings on RateMyProfessors.com</a>";
  
      }else if(avgProfRating >= 2.5 && avgProfRating <= 3.3){
  
        return "<img src=" + chrome.extension.getURL('./assets/rmp-average.jpg') +
        "><br><b>Overall Rating: </b>" + jsonObject['avgRating'] + "/5 based on " + 
        jsonObject['totalRatings'] + " ratings. <br><b>Difficulty: </b>" + jsonObject['profHardness'] +
         "/5<br>" + "<a href=" + ratingURL + jsonObject['profID'] + " target='_blank'>View Ratings on RateMyProfessors.com</a>";
      }else if(avgProfRating <= 2.4){
  
        return "<img src=" + chrome.extension.getURL('./assets/rmp-poor.jpg') +
        "><br><b>Overall Rating: </b>" + jsonObject['avgRating'] + "/5 based on " + 
        jsonObject['totalRatings'] + " ratings. <br><b>Difficulty: </b>" + jsonObject['profHardness'] +
         "/5<br>" + "<a href=" + ratingURL + jsonObject['profID'] + " target='_blank'>View Ratings on RateMyProfessors.com</a>";
      }
    }else{
      return "<img src=" + chrome.extension.getURL('./assets/rmp-zero.jpg') + "><br><b>Overall Rating: </b>No ratings were found <br><b>Difficulty:</b> No ratings were found ";
    }
  
  }