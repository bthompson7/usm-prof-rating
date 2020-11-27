/*

Contains useful functions that are shared between different scripts 

*/

"use strict";

const titles = ['PhD','Ph.D.','MSN','RN', 'APRN-BC','CPNP-PC',
'FNAP','MS','BS','AGACNP-BC','DNP','MSN','Chairman',
'Chairwoman','Chairperson','M.D.','CNE','BSN','DNSc,','M.S.',
'MS','M.A.','MA','RN-BC','MBA','NP-C','CCRN','AGPCNP-BC','APRN','PMH-NP',
'CHSOS','MPH','Chair','Dean','President','Associate Dean','V.M.D.','FAANP','FNP-BC'];

//Maps Nick Name => Full Name
let names = new Map();
names.set('Tim','Timothy');
names.set('Bob','Robert');


/*

Any courses where we can't find the professor using the 
firstname + lastname we will lookup the professor using the last name and
then checking if they match the current subject we are in.

This will get updated as I find them.

*/
let courses = new Map();
courses.set("BIO","Biology")
courses.set("CHY","Chemistry")
courses.set("MAT","Mathematics")

/*

Convert a full name to a nickname 

*/

function fullNameToNick(name){
    if(nickNames.get(name) !== undefined){
        return nickNames.get(name);
    }else{
        return null;
    }
}

/*

Keep a list of professors who we need to lookup using their last  name

*/

let profDepartments = new Map();
profDepartments.set("Levine","Biology");

/*

Lookup a course

*/

function getCourse(courseName){
    if(courses.get(courseName) !== undefined){
        return courses.get(courseName);
    }else{
        return null;
    }
}

/*

Lookup a prfoessors department

*/

function getProfDepartment(profName){
    if(profDepartments.get(profName) !== undefined){
        return profDepartments.get(profName);
    }else{
        return null;
    }
}

/*

Get 1 week in unix time

*/

function getOneWeekInUnixTime(){
    return 518400;
}

/*

Get the current unix time

*/

function getCurrentUnixTime(){
    return Math.floor(Date.now() / 1000);
}

/*

Removes extra words/titles from a persons name

For example:
Shelton Waldrep, Chair => Shelton Waldrep
Brenda Petersen PhD, MSN, RN, APRN-BC, CPNP-PC => Brenda Petersen

*/

function removeTitlesFromName(profNameList){
for(var i = profNameList.length - 1; i > 0; i--){
    for(var j =0; j < titles.length; j++){
        var name = profNameList[i]

        if(name.includes(titles[j]) || name.includes(titles[j] + "," ||
         "," + name.includes(titles[j]) || "," + name.includes(titles[j]) + ",")){

            profNameList.pop();
            break;
        }
    }
}
return profNameList;
}


/*

Return the fullname based on the nickname given

*/

function nickNameToFull(name){
    if(names.get(name) !== undefined){
        return names.get(name);
    }else{
        return null;
    }
}


/*
Round the number to 1 decimal point

*/

function roundNumber(num){
    if(num === undefined){
        return null;
    }
    return Math.round(num * 10) / 10;


}


  function searchIfNeeded(splitName,tag,collegeName){


    var rating = "";

     //data doesn't exist in cache
    if(!localStorage[splitName[0] + " " + splitName[splitName.length - 1]]){
    searchForProfessor(splitName[0],splitName[splitName.length - 1],collegeName,tag);

    //data exists check if we need to update it
    }else{ 
        rating = localStorage[splitName[0] + " " + splitName[splitName.length - 1]];
        var ratingObject = JSON.parse(rating);


        //check if we need to refresh the ratings
        if(getCurrentUnixTime() - ratingObject['lastUpdated'] < getOneWeekInUnixTime()){
            tag.insertAdjacentHTML('afterend', '<div class="rmp-rating">' + jsonToHTML(ratingObject) + '</div>');
        }else{
            console.log("Data is old, getting new data from the RMP.com api!")
            localStorage.removeItem(splitName[0] + " " + splitName[splitName.length - 1])
            searchForProfessor(splitName[0],splitName[splitName.length - 1],collegeName,tag);  
        }
    }
}