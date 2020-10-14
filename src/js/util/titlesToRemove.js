const titles = ['PhD','Ph.D.','MSN','RN', 'APRN-BC','CPNP-PC',
'FNAP','MS','BS','AGACNP-BC','DNP','MSN','Chairman',
'Chairwoman','Chairperson','M.D.','CNE','BSN','DNSc,','M.S.',
'MS','RN-BC','MBA','NP-C','CCRN','AGPCNP-BC','APRN','PMH-NP',
'CHSOS','MPH','Chair'];

const nickNames = [
{'Bob':'Robert'}
]

/*
Utility function to remove extra words from a persons name for example 

John Smith Ph.D would be just John Smith 

*/

function removeTitlesFromName(profNameList){
    console.log("Before = " + profNameList);

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

console.log("After = " + profNameList);
return profNameList;


}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  

function nickNameToFull(name){

}

