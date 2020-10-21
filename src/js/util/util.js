/*

util.js contains useful functions that are shared between different scripts so it makes the code cleaner 
because I don't have to repeat myself

*/

"use strict";

const titles = ['PhD','Ph.D.','MSN','RN', 'APRN-BC','CPNP-PC',
'FNAP','MS','BS','AGACNP-BC','DNP','MSN','Chairman',
'Chairwoman','Chairperson','M.D.','CNE','BSN','DNSc,','M.S.',
'MS','RN-BC','MBA','NP-C','CCRN','AGPCNP-BC','APRN','PMH-NP',
'CHSOS','MPH','Chair','Dean','President','Associate Dean','V.M.D.'];


//Maps Nick Name => Full Name
let names = new Map()
names.set('Tim','Timothy');
names.set('Bob','Robert');

/*

**FUNCTION START**

*/


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

Function to remove extra words/titles from a persons name

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

Convert a json object into an html tag to display

*/
function jsonToHTML(jsonObject){

  
    var ratingURL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid=";
    if(jsonObject['foundProf']){
      var avgProfRating = jsonObject['avgRating'];
  
      if(avgProfRating >= 3.0){
        return "<img src=" + chrome.extension.getURL('./assets/rmp-good.jpg') +
         "><br><b>Overall Rating: </b>" + jsonObject['avgRating'] + "/5 based on " + 
         jsonObject['totalRatings'] + " ratings. <br><b>Difficulty: </b>" + jsonObject['profHardness'] +
          "/5<br>" + "<a href=" + jsonObject['profID'] + ">View Ratings on RateMyProfessors.com</a>";
  
      }else if(avgProfRating >= 2.0 && avgProfRating <= 2.9){
  
        return "<img src=" + chrome.extension.getURL('./assets/rmp-average.jpg') +
        "><br><b>Overall Rating: </b>" + jsonObject['avgRating'] + "/5 based on " + 
        jsonObject['totalRatings'] + " ratings. <br><b>Difficulty: </b>" + jsonObject['profHardness'] +
         "/5<br>" + "<a href=" + jsonObject['profID'] + ">View Ratings on RateMyProfessors.com</a>";
      }else if(avgProfRating < 2.0){
  
        return "<img src=" + chrome.extension.getURL('./assets/rmp-poor.jpg') +
        "><br><b>Overall Rating: </b>" + jsonObject['avgRating'] + "/5 based on " + 
        jsonObject['totalRatings'] + " ratings. <br><b>Difficulty: </b>" + jsonObject['profHardness'] +
         "/5<br>" + "<a href=" + jsonObject['profID'] + ">View Ratings on RateMyProfessors.com</a>";
      }
    }else{
      return "<b>Overall Rating: </b>No ratings were found <br><b>Difficulty:</b> No ratings were found ";
    }
  
  }