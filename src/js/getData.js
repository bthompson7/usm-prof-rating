/*

Handles getting all the data from RateMyProfessor

*/
var proxyURL = "https://cors-anywhere.herokuapp.com/"

function getProfRating(firstName,lastName,university,nameTag){
    var url = `https://www.ratemyprofessors.com/search.jsp?query=${firstName}+${lastName}+${university}`;

//GET request #1
const Http = new XMLHttpRequest();
var profLink = "";
var displayRating = "";

Http.open("GET", url, true);
Http.onreadystatechange = (e) => {
     if(Http.status == 200 && Http.readyState == 4){
      var parser = new DOMParser();
      doc = parser.parseFromString(Http.response, "text/html");
      var ratingDivElement = doc.getElementsByClassName("listing PROFESSOR");
      var ratingLinkElement = ratingDivElement[0].getElementsByTagName('a');
      profLink = proxyURL + baseURL + ratingLinkElement[0].getAttribute("href");
  
      const Http2 = new XMLHttpRequest();
  
      //GET Request #2 will fetch the rating once we have the professor name
      Http2.open("GET", profLink, true);
      Http2.onreadystatechange = (e2) => {
          if(Http2.status == 200 && Http2.readyState == 4){
            var parser2 = new DOMParser();
            var doc2 = parser2.parseFromString(Http2.response, "text/html");
            var rating = doc2.querySelector("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.fOncgC > div.TeacherRatingsPage__TeacherBlock-a57owa-1.gmNsKR > div.TeacherInfo__StyledTeacher-ti1fio-1.fIlNyU > div:nth-child(1) > div.RatingValue__AvgRating-qw8sqy-1.gIgExh > div > div.RatingValue__Numerator-qw8sqy-2.gxuTRq")
            var numOfRatings = doc2.querySelector("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.fOncgC > div.TeacherRatingsPage__TeacherBlock-a57owa-1.gmNsKR > div.TeacherInfo__StyledTeacher-ti1fio-1.fIlNyU > div:nth-child(1) > div.RatingValue__NumRatings-qw8sqy-0.jvzMox > div > a");
            var levelOfDifficulty = doc2.querySelector("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.fOncgC > div.TeacherRatingsPage__TeacherBlock-a57owa-1.gmNsKR > div.TeacherInfo__StyledTeacher-ti1fio-1.fIlNyU > div.TeacherFeedback__StyledTeacherFeedback-gzhlj7-0.jCDePN > div > div.FeedbackItem__FeedbackNumber-uof32n-1.bGrrmf");
            console.log("Rating = " + rating.innerHTML + " num =  " + numOfRatings.innerHTML);
            displayRating = "<b>RMP Rating: </b>" + rating.innerHTML + "/5\n based on " + numOfRatings.innerHTML;
            localStorage.setItem(firstName + " " + lastName, displayRating);

            if(displayRating !== ""){
              nameTag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + displayRating +  '</div>');
           }else{
              nameTag.insertAdjacentHTML('afterend', '<div class="rmp-no-rating"><b>RMP Rating:</b> No Rating Found</div>');
          }
      
          }
    }
    Http2.send();

     }
  }
  
Http.send();

}