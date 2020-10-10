/*

Handles getting all the data from RateMyProfessor

*/

function getProfRating(firstName,lastName,university){
    var url = `https://www.ratemyprofessors.com/search.jsp?query=${firstName}+${lastName}+${university}`;

//GET request #1
const Http = new XMLHttpRequest();
var parser = new DOMParser();
var profLink = "";
var displayRating = "";

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
        var numOfRatings = doc.querySelector("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.fOncgC > div.TeacherRatingsPage__TeacherBlock-a57owa-1.gmNsKR > div.TeacherInfo__StyledTeacher-ti1fio-1.fIlNyU > div:nth-child(1) > div.RatingValue__NumRatings-qw8sqy-0.jvzMox > div > a")
        displayRating = "<b>RMP Rating: </b>" + rating[0].innerHTML + "/5\n based on " + numOfRatings.innerHTML;

  }
  Http2.onerror = (e) =>{
    console.error("Unable to fetch data from RateMyProfessor");
    alert("Unable to fetch data from RateMyProfessor");
  }
   Http2.send(null);

  }

Http.onerror = (e) =>{
    console.error("Unable to fetch data from RateMyProfessor");
    alert("Unable to fetch data from RateMyProfessor");
}
Http.send(null);


   return displayRating;

}