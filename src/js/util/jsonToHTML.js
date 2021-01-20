/*

Convert a json object into an html tag to display on the webpage

*/

"use strict";

function jsonToHTML(jsonObject){

  
    var ratingURL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid=";
    if(jsonObject['foundProf']){
      var avgProfRating = jsonObject['avgRating'];
  
      if(avgProfRating >= 3.4){
        return "<img id='rmp-img' src=" + chrome.extension.getURL('assets/rmp-good.jpg') +
         "><br><b>Overall Rating: </b>" + jsonObject['avgRating'] + "/5 based on " + 
         jsonObject['totalRatings'] + " ratings. <br><b>Difficulty: </b>" + jsonObject['profHardness'] +
          "/5<br>" + "<a href=" + ratingURL + jsonObject['profID'] + " target='_blank' >View Ratings on RateMyProfessors.com</a>";
  
      }else if(avgProfRating >= 2.5 && avgProfRating <= 3.3){
  
        return "<img id='rmp-img' src=" + chrome.extension.getURL('assets/rmp-average.jpg') +
        "><br><b>Overall Rating: </b>" + jsonObject['avgRating'] + "/5 based on " + 
        jsonObject['totalRatings'] + " ratings. <br><b>Difficulty: </b>" + jsonObject['profHardness'] +
         "/5<br>" + "<a href=" + ratingURL + jsonObject['profID'] + " target='_blank'>View Ratings on RateMyProfessors.com</a>";
      }else if(avgProfRating <= 2.4){
  
        return "<img id='rmp-img' src=" + chrome.extension.getURL('assets/rmp-poor.jpg') +
        "><br><b>Overall Rating: </b>" + jsonObject['avgRating'] + "/5 based on " + 
        jsonObject['totalRatings'] + " ratings. <br><b>Difficulty: </b>" + jsonObject['profHardness'] +
         "/5<br>" + "<a href=" + ratingURL + jsonObject['profID'] + " target='_blank'>View Ratings on RateMyProfessors.com</a>";
      }
    }else{
      return "<img id='rmp-img' src=" + chrome.extension.getURL('assets/rmp-zero.jpg') + "><br><b>Overall Rating: </b>No ratings were found <br><b>Difficulty:</b> No ratings were found ";
    }
  
  }

