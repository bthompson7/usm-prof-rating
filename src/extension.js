
/*

Author: Ben Thompson
Description: 

This script/extension is activated on https://usm.maine.edu/courses*. 
It looks up the RateMyProfessor rating for each professor on the page and then displays it on the page
so that people dont' have to keep switching tabs.

Eventually I will add support for mainestreet but since
I have graduated I don't really have access to course
searching anymore so whatever I will see what I can do once classes open up in the fall/spring.

Will probably have to email RMP to get their permission 

https://www.ratemyprofessors.com/utility/contact#support

*/


var proxyURL = "https://cors-anywhere.herokuapp.com/"
var baseURL = "https://www.ratemyprofessors.com"

getProfNamesFromPage();


/*

This function gets a list of professor 
names from the https://usm.maine.edu/courses page by
reading the html on the current page

*/
function getProfNamesFromPage(){
var listOfNames = document.getElementsByClassName("instructor-link section-item");
for(var i =0; i < listOfNames.length; i++){
    var name = listOfNames[i].getElementsByTagName('a')[0].innerHTML;
    var nameTag = listOfNames[i].getElementsByTagName('a')[0];
    var rating = "";
    var res = name.split(" ");

    //use rating from localStorage if possible to reduce api calls
    if(res.length == 2 && !localStorage[res[0] + " " + res[1]]){
        rating = getProfRating(res[0],res[1]);
        localStorage.setItem(res[0] + " " + res[1], rating);
    }else if(res.length == 2 && localStorage[res[0] + " " + res[1]]){
        rating = localStorage[res[0] + " " + res[1]];
    }else if(res.length == 3 && !localStorage[res[0] + " " + res[2]]){
        rating = getProfRating(res[0],res[2]);
        localStorage.setItem(res[0] + " " + res[2], rating);
    }else if(res.length == 3 && localStorage[res[0] + " " + res[2]]){
        rating = localStorage[res[0] + " " + res[2]];
    }

    //inserting html on the page
    if(rating !== ""){
        nameTag.insertAdjacentHTML('afterend', '<p class="rmp-rating">' + rating + '</p>');

    }else{
        nameTag.insertAdjacentHTML('afterend', '<p class="rmp-no-rating"><b>Rating:</b> No Rating Found</p>');
    }
}
}


/*

This function handles getting all the data from RateMyProfessor

*/

 function getProfRating(firstName,lastName){
    var url = "https://www.ratemyprofessors.com/search.jsp?query="+firstName+ "+" +lastName+"+University+of+Southern+Maine";

//GET request #1
const Http = new XMLHttpRequest();
var parser = new DOMParser();

var profLink = "";
var displayRating = "";
console.log(url);

Http.open("GET", url, false);
Http.onreadystatechange = (e) => {
    doc = parser.parseFromString(Http.response, "text/html");
  
    var ratingDivElement = doc.getElementsByClassName("listing PROFESSOR");
  
    var ratingLinkElement = ratingDivElement[0].getElementsByTagName('a');
  
    profLink = proxyURL + baseURL + ratingLinkElement[0].getAttribute("href");

    const Http2 = new XMLHttpRequest();

    //GET Request #2 will fetch the rating once we have the professor name
    Http2.open("GET", profLink, false);
    Http2.setRequestHeader('Content-Type', 'text/html');
    Http2.setRequestHeader('Access-Control-Allow-Origin','*');
    Http2.onreadystatechange = (e2) => {
        doc = parser.parseFromString(Http2.response, "text/html");
        var rating = doc.getElementsByClassName("RatingValue__Numerator-qw8sqy-2 gxuTRq");
        var wouldTakeAgain = doc.getElementsByClassName("FeedbackItem__FeedbackNumber-uof32n-1 bGrrmf");
        displayRating = "<b>RMP Rating: </b>" + rating[0].innerHTML + "/5\n" + wouldTakeAgain[0].innerHTML + " would take a class with them again";
        console.log(displayRating);

  }
  Http2.onerror = (e) =>{
    console.error("Unable to fetch data from RateMyProfessor")
  }
   Http2.send(null);

  }

Http.onerror = (e) =>{
    console.error("Unable to fetch data from RateMyProfessor")
}
Http.send(null);


   return displayRating;

}