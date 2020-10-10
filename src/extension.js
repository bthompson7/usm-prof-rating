
/*

Author: Ben Thompson
Description: 

This script/extension is activated on https://usm.maine.edu/courses*. 
It looks up the RateMyProfessor rating for each professor on the page and then displays it on the page
so that people don't have to keep switching tabs.


TODO:
Short Term:
-Will probably have to email RMP to get their permission since scraping their website is against their TOS. 
https://www.ratemyprofessors.com/utility/contact#support
-Bug fixes for weird edge cases or anything else
-
-

Long Term:
-Add support for Mainestreet class searching
-Add Support for prof. pages like https://usm.maine.edu/eng/mike-bendzela
-

*/


var proxyURL = "https://cors-anywhere.herokuapp.com/"
var baseURL = "https://www.ratemyprofessors.com"





console.log("EXTENSION WORKING...");
var win = window.location.href;
console.log(win.indexOf("https://mainestreetcs.maine.edu/psp") > -1)
if(win.indexOf("https://mainestreetcs.maine.edu/psp") > -1){
    getProfNamesFromMainestreet();
}else{
    getProfNamesFromPage();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

/*

This function gets a list of professors from https://mainestreetcs.maine.edu/*

https://mainestreetcs.maine.edu/psp/CSPRD/EMPLOYEE/SA/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL?Action=A&ACAD_CAREER=*&EMPLID=*&INSTITUTION=*&STRM=*

*/

async function getProfNamesFromMainestreet(){
    console.log("Going into getProfNamesFromMainestreet function...");
    //tag with prof name is <span class="PSLONGEDITBOX" id="MTG_INSTR$2">Rebecca Goodale</span>

    while(true){
        if(document.querySelector("#MTG_INSTR\\$0")){
            break;
        }
        console.log("Sleeping...")

        await sleep(1000)
    }

    console.log("found correct element!");
    var index = 0;
    let listOfNames = [];
    while(document.querySelector("#MTG_INSTR\\$" + index)){
        var name = document.querySelectorAll("#MTG_INSTR\\$" + index)
        console.log(name);
        listOfNames.push(name);
    }

    console.log("Found the element " + listOfNames.length);
    for(var i =0; i < listOfNames.length; i++){
        var name = document.querySelectorAll('[id*="MTG_INSTR"]')[0].getElementsByClassName('PSLONGEDITBOX')[i].innerText;
        console.log(name);
    }



}

/*

This function gets a list of professor 
names from the https://usm.maine.edu/courses page by
reading the html on the current page

*/
function getProfNamesFromPage(){
var listOfNames = document.getElementsByClassName("instructor-link section-item");
for(var i =0; i < listOfNames.length; i++){
    try{
        var name = listOfNames[i].getElementsByTagName('a')[0].innerHTML;
        var nameTag = listOfNames[i].getElementsByTagName('a')[0];
        var rating = "";
        var res = name.split(" ");
        console.log(res);

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
        nameTag.insertAdjacentHTML('afterend', '<p class="rmp-no-rating"><b>RMP Rating:</b> No Rating Found</p>');
    }
    }catch(err){
        console.error("No professor exists for this class");
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
        var numOfRatings = doc.querySelector("#root > div > div > div.PageWrapper__StyledPageWrapper-sc-3p8f0h-0.fOncgC > div.TeacherRatingsPage__TeacherBlock-a57owa-1.gmNsKR > div.TeacherInfo__StyledTeacher-ti1fio-1.fIlNyU > div:nth-child(1) > div.RatingValue__NumRatings-qw8sqy-0.jvzMox > div > a")
        console.log(numOfRatings.innerHTML);
        //var wouldTakeAgain = doc.getElementsByClassName("FeedbackItem__FeedbackNumber-uof32n-1 bGrrmf");
        displayRating = "<b>RMP Rating: </b>" + rating[0].innerHTML + "/5\n based on " + numOfRatings.innerHTML;
        console.log(displayRating);

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