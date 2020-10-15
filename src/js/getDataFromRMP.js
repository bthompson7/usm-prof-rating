/*

Handles getting all the data from RateMyProfessor

*/

var proxyURL = "https://intense-fjord-93634.herokuapp.com/"
var baseURL = "https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q=";


function getProfRating(firstName,lastName,university,nameTag){
var fullURL = proxyURL + "https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q="+firstName + "+" +lastName + "+" + university;

const Http = new XMLHttpRequest();
Http.open("GET", fullURL, true);

Http.onreadystatechange = (e) => {
     if(Http.status == 200 && Http.readyState == 4){
      var displayRating = parseJSON(Http.response);
      if(displayRating !== ""){
        nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + displayRating +  '</div>');
        if(!localStorage.getItem(firstName + " " + lastName)){
          localStorage.setItem(firstName + " " + lastName,displayRating);
        }

      }
     }
    }
Http.send();

}

/*

To test to make sure the proxy url only allows requests from whitelisted domains on heroku

*/

function getProfRatingTest(firstName,lastName,university){
  var fullURL = proxyURL + "https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q="+$(firstName) + "+" +$(lastName) + "+" + $(university);
  
  const Http = new XMLHttpRequest();
  var profLink = "";
  var displayRating = "";
  
  Http.open("GET", fullURL, true);
  Http.onreadystatechange = (e) => {
       if(Http.status == 200 && Http.readyState == 4){
        var displayRating = parseJSON(Http.response);
       }
      }
  Http.send();
  
  }

function parseJSON(json){
  try{
    var data = JSON.parse(json);
    var aveRating = data['response']['docs'][0]['averageratingscore_rf'];
    var totalRatings = data['response']['docs'][0]['total_number_of_ratings_i'];
    var isProfHard = data['response']['docs'][0]['averageeasyscore_rf'];
    var profID = data['response']['docs'][0]['pk_id'];
    var ratingsURL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid="+profID;

    if(totalRatings > 0){
      return "<b>Overall Rating: </b>" + aveRating + "/5 based on " + totalRatings + " ratings. <br><b>Difficulty: </b>" + isProfHard + "/5<br>" + "<a href=" + ratingsURL  +  ">View Ratings on RateMyProfessors.com</a>";
    }else{
      return "<b>Overall Rating: </b>No ratings were found <br><b>Difficulty:</b> No ratings were found ";
    }
    
  }catch(err){
    return "<b>Overall Rating: </b>No ratings were found <br><b>Difficulty:</b> No ratings were found ";
  }
  
}

