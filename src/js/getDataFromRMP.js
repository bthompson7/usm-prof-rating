/*

Handles getting all the data from RateMyProfessor

https://www.ratemyprofessors.com/paginate/professors/ratings?tid=202316&page=0&max=20

*/

var fullURL = "https://intense-fjord-93634.herokuapp.com/https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q=";

function getProfRating(firstName,lastName,university,nameTag){
var query = `${fullURL} + ${firstName}+${lastName}+${university}`;

const Http = new XMLHttpRequest();

  Http.open("GET", query, true);
  
  Http.onreadystatechange = (e) => {
       if(Http.status == 200 && Http.readyState == 4){
        var ratingData = parseDataFromRMP(Http.response);

        var htmlToInsert = jsonToHTML(ratingData);

          nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + htmlToInsert +  '</div>');
          if(!localStorage.getItem(firstName + " " + lastName)){
            localStorage.setItem(firstName + " " + lastName,JSON.stringify(ratingData));

            var local = localStorage.getItem(firstName + " " + lastName);
            console.log(local);
          }
       }
      }

  Http.send();  
}

function parseDataFromRMP(jsonData){
  try{
    var data = JSON.parse(jsonData);
    var avgRating = roundNumber(data['response']['docs'][0]['averageratingscore_rf']);
    var totalRatings = data['response']['docs'][0]['total_number_of_ratings_i'];
    var profHardness = roundNumber(data['response']['docs'][0]['averageeasyscore_rf']);
    var profID = data['response']['docs'][0]['pk_id'];
    var ratingsURL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid="+profID;
    var lastUpdated = getCurrentUnixTime();

    if(avgRating === null){
      var noProfFound = {'foundProf':false,'avgRating':'No ratings found',
     'profHardness':'No ratings found', "lastUpdated":lastUpdated};
    return noProfFound;
    }

   

    var foundProf = {'foundProf':true,'avgRating':avgRating, 'totalRatings':totalRatings,
    'profHardness':profHardness,'profID':profID,'ratingsURL':ratingsURL,'lastUpdated':lastUpdated};
     return foundProf;

  }catch(err){

    var lastUpdated = getCurrentUnixTime();
    var noProfFound = {'foundProf':false,'avgRating':'No ratings found',
     'profHardness':'No ratings found', "lastUpdated":lastUpdated};
    return noProfFound;

  }
  
}



