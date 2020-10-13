/*

Handles getting all the data from RateMyProfessor

*/
var proxyURL = "https://intense-fjord-93634.herokuapp.com/"
var baseURL = "https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q=";


function getProfRating(firstName,lastName,university,nameTag){
var fullURL = proxyURL + "https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q="+firstName + "+" +lastName + "+" + university;

//GET request #1
const Http = new XMLHttpRequest();
var profLink = "";
var displayRating = "";

Http.open("GET", fullURL, true);
Http.onreadystatechange = (e) => {
     if(Http.status == 200 && Http.readyState == 4){
      console.log(Http.response);
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
  var fullURL = proxyURL + "https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q="+firstName + "+" +lastName + "+" + university;
  
  //GET request #1
  const Http = new XMLHttpRequest();
  var profLink = "";
  var displayRating = "";
  
  Http.open("GET", fullURL, true);
  Http.onreadystatechange = (e) => {
       if(Http.status == 200 && Http.readyState == 4){
        console.log(Http.response);
        var displayRating = parseJSON(Http.response);
        console.log(displayRating);
       }
      }
  Http.send();
  
  }

function parseJSON(json){

  var data = JSON.parse(json);
  var aveRating = data['response']['docs'][0]['averageratingscore_rf'];
  var totalRatings = data['response']['docs'][0]['total_number_of_ratings_i'];
  var isProfHard = data['response']['docs'][0]['averageeasyscore_rf'];
 return "<b>Overall Rating: </b>" + aveRating + "/5 based on " + totalRatings + " ratings. <br><b>Difficulty: </b>" + isProfHard + "/5";
}

