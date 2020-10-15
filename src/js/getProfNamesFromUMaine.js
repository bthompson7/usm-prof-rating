/*
Gets a list of professor names from https://online.umaine.edu/course-search 
*/


getProfNamesFromUMaine();



function getProfNamesFromUMaine(){
    var collegeName = "Maine";

    console.log("UMaine Course Search")

    var listOfNames = document.getElementsByClassName("classAttributeLeftHalf instructorList");
for(var i =0; i < listOfNames.length; i++){
    try{
        var professorName = listOfNames[i].getElementsByTagName('a')[0].innerHTML;
        var nameTag = listOfNames[i].getElementsByTagName('a')[0];
        var splitName = professorName.split(" ");

        console.log(splitName);
    //use rating from localStorage if possible to reduce the number of calls to CORS Proxy/RMP
    getAndDisplayData(splitName,nameTag,collegeName);

    }catch(err){
        console.error(err + "No professor exists for this class");
    }
}

}



function getAndDisplayData(splitName,tag,collegeName){

    var rating = "";

    if(splitName.length == 2 && !localStorage[splitName[0] + " " + splitName[1]]){
        getProfRating(splitName[0],splitName[1],collegeName,tag);
    }else if(splitName.length == 2 && localStorage[splitName[0] + " " + splitName[1]]){
        rating = localStorage[splitName[0] + " " + splitName[1]];
        tag.insertAdjacentHTML('afterend', '<p class="rmp-rating">' + rating + '</p>');
    }else if(splitName.length == 3 && !localStorage[splitName[0] + " " + splitName[2]]){
        getProfRating(splitName[0],splitName[2],collegeName,tag);
    }else if(splitName.length == 3 && localStorage[splitName[0] + " " + splitName[2]]){
        rating = localStorage[splitName[0] + " " + splitName[2]];
        tag.insertAdjacentHTML('afterend', '<p class="rmp-rating">' + rating + '</p>');
    }
}
