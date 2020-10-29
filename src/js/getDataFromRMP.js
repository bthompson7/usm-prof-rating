/*

Search for a professor using data from RateMyProfessor


*/

var fullURL = "https://intense-fjord-93634.herokuapp.com/https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q=";

var foundProfessorAfterSearch = false;


function searchForProfessor(firstName,lastName,university,nameTag){
var query = `${fullURL} + ${firstName}+${lastName}+${university}`;

const Http = new XMLHttpRequest();

  Http.open("GET", query, true);
  
  Http.onreadystatechange = (e) => {
       if(Http.status == 200 && Http.readyState == 4){
         var ratingData = parseDataFromRMP(Http.response);

         if(ratingData['foundProf']){
          var htmlToInsert = jsonToHTML(ratingData);

          nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + htmlToInsert +  '</div>');
          if(!localStorage.getItem(firstName + " " + lastName)){
            localStorage.setItem(firstName + " " + lastName,JSON.stringify(ratingData));
          }
         }else{ //search using last name
          searchUsingLastName(firstName,lastName,university,nameTag);

          if(!foundProfessorAfterSearch){ //we didn't find the professor
            var lastUpdated = getCurrentUnixTime();
            var noProfFound = {'foundProf':false,'avgRating':'No ratings found','profHardness':'No ratings found', "lastUpdated":lastUpdated};
            var htmlToInsert = jsonToHTML(noProfFound);
            nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + htmlToInsert +  '</div>');
            if(!localStorage.getItem(firstName + " " + lastName)){
              localStorage.setItem(firstName + " " + lastName,JSON.stringify(noProfFound));
            }
          }
         }

        
       }
      }

  Http.send();  
}


/*

If we can't find the professor we try the last  name then check the department to make sure it matches the current subject we are in

*/
function searchUsingLastName(firstName,lastName,university,nameTag){

  if(university === "Maine"){
    var currentSubjectElement = document.getElementById("umsCS_Subject-5f9a32cdab8c0");
    var currentSubject = currentSubjectElement.value.substring(0, 3);
    var fullSubjectName = getCourse(currentSubject);

  }else{
    var currentSubjectElement = document.getElementById("edit-subject");
    var currentSubject = currentSubjectElement.value;
    var fullSubjectName = getCourse(currentSubject);

  }


  var query2 = `${fullURL} + ${lastName}+${university}`;

  const Http = new XMLHttpRequest();
  
    Http.open("GET", query2, true);
    
    Http.onreadystatechange = (e) => {
         if(Http.status == 200 && Http.readyState == 4){

          var data = JSON.parse(Http.response);

          for(var i=0; i < data['response']['numFound']; i++){
            var ratingData = parseDataFromRMP(Http.response);

            if(ratingData['foundProf'] && ratingData['department'] === fullSubjectName){
              var htmlToInsert = jsonToHTML(ratingData);

              foundProfessorAfterSearch = true;
              nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + htmlToInsert +  '</div>');
              if(!localStorage.getItem(firstName + " " + lastName)){
                localStorage.setItem(firstName + " " + lastName,JSON.stringify(ratingData));
              }
              break;
            }
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
    var department = data['response']['docs'][0]['teacherdepartment_s']
    var lastUpdated = getCurrentUnixTime();

    if(avgRating === null){
      var noProfFound = {'foundProf':false,'avgRating':'No ratings found',
     'profHardness':'No ratings found', "lastUpdated":lastUpdated};
    return noProfFound;
    }

    var foundProf = {'foundProf':true,'department':department,'avgRating':avgRating, 'totalRatings':totalRatings,
    'profHardness':profHardness,'profID':profID,'ratingsURL':ratingsURL,'lastUpdated':lastUpdated};
     return foundProf;

  }catch(err){

    var lastUpdated = getCurrentUnixTime();
    var noProfFound = {'foundProf':false,'avgRating':'No ratings found',
     'profHardness':'No ratings found', "lastUpdated":lastUpdated};
    return noProfFound;

  }
  
}

