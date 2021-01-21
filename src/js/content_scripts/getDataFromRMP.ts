/*

Search for a professor using data from RateMyProfessor

*/

var fullURL = "https://intense-fjord-93634.herokuapp.com/https://search-production.ratemyprofessors.com/solr/rmp/select/?solrformat=true&rows=2&wt=json&q=";

function searchForProfessor(firstName: string,lastName: string,university: string,nameTag: Element){

var findProfessorURL = `${fullURL} + ${firstName} + ${lastName} + ${university}`;
const httpRequest = new XMLHttpRequest();

httpRequest.open("GET", findProfessorURL);
httpRequest.onreadystatechange = () => {
       if(httpRequest.status == 200 && httpRequest.readyState == 4){
         var ratingData = parseDataFromRMP(httpRequest.response);

         if(ratingData['foundProf']){

              //rating doesn't exist
              if(!localStorage.getItem(firstName + " " + lastName)){
                localStorage.setItem(firstName + " " + lastName,JSON.stringify(ratingData));
                nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + jsonToHTML(ratingData) + '</div>');

              }else{ //rating exists, check if we need to update the ratings

                 if(getCurrentUnixTime() - ratingData['lastUpdated'] < getOneWeekInUnixTime()){
                  nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + jsonToHTML(ratingData) + '</div>');
                 }else{

                  //fetch data from RMP
                   console.log("Data is old, getting new data from the RMP.com api!")
                   localStorage.removeItem(firstName + " " + lastName)
                   searchForProfessor(firstName,lastName,collegeName,nameTag);  

                 }
                }
         }else{ //search using last name
          searchUsingLastName(firstName,lastName,university,nameTag);
         }
       }
      }
      httpRequest.send();  
}


/*

If we can't find the professor we try the last name 
then check the department to make sure it matches the current subject we are in

*/
function searchUsingLastName(firstName: string,lastName: string,university: string,nameTag: Element){


  if(university === "Maine"){
    var currentSubjectElement = document.getElementsByTagName('select')[2];
    var currentSubject = currentSubjectElement.value.substring(0, 3);
    var fullSubjectName = getCourse(currentSubject);

  }else{
    try{

      if(window.location.href.includes('https://mainestreetcs.maine.edu/')){

        var iframe: any = document.querySelector("#ptifrmtgtframe");
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        var currentSubjectElement: HTMLSelectElement = innerDoc.querySelector("#win0divDERIVED_CLSRCH_SSR_CLSRCH_CRIT > div > table > tbody > tr > td > strong:nth-child(1)");
        var department = currentSubjectElement.innerHTML;

      }else{
        var inputValue = (<HTMLInputElement>document.getElementById("edit-subject")).value;
        var department: string = getCourse(inputValue);
      }
      
    }catch(err){
      var department = getProfDepartment(lastName)!;
    }
  }


  var lastNameURL = `${fullURL} + ${lastName}+${university}`;

  const httpRequest = new XMLHttpRequest();
  
  httpRequest.open("GET", lastNameURL);
  httpRequest.onreadystatechange = () => {
         if(httpRequest.status == 200 && httpRequest.readyState == 4){

          //parse data to get the number of results found
          var data = JSON.parse(httpRequest.response);

          for(var i=0; i < data['response']['numFound']; i++){
            var ratingData: any = parseDataFromRMP(httpRequest.response);

            if(ratingData['foundProf'] && ratingData['department'] === department){
              var htmlToInsert = jsonToHTML(ratingData);

              nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + htmlToInsert +  '</div>');
         
              if(!localStorage.getItem(firstName + " " + lastName)){
                localStorage.setItem(firstName + " " + lastName,JSON.stringify(ratingData));
              }
              return;
            }
          }

            //we didnt find the professor
            var lastUpdated = getCurrentUnixTime();
            var noProfFound = {'foundProf':false,'avgRating':'No ratings found','profHardness':'No ratings found', "lastUpdated":lastUpdated};
            var htmlToInsert = jsonToHTML(noProfFound);
            nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + htmlToInsert +  '</div>');
            if(!localStorage.getItem(firstName + " " + lastName)){
              localStorage.setItem(firstName + " " + lastName,JSON.stringify(noProfFound));
            }
         }
        }
  
        httpRequest.send(); 
}

function parseDataFromRMP(jsonData: any){
  try{
    var data = JSON.parse(jsonData);
    var avgRating = roundNumber(data['response']['docs'][0]['averageratingscore_rf']);
    var totalRatings = data['response']['docs'][0]['total_number_of_ratings_i'];
    var profHardness = roundNumber(data['response']['docs'][0]['averageeasyscore_rf']);
    var profID = data['response']['docs'][0]['pk_id'];
    var ratingsURL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid="+profID;
    var department = data['response']['docs'][0]['teacherdepartment_s']
    var lastUpdated = getCurrentUnixTime();

    //this is because sometimes the professor exists but has no ratings
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

