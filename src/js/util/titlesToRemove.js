const titles = ['PhD','Ph.D.','MSN','RN', 'APRN-BC','CPNP-PC',
'FNAP','MS','BS','AGACNP-BC','DNP','MSN','Chairman',
'Chairwoman','Chairperson','M.D.','CNE','BSN','DNSc,','M.S.',
'MS','RN-BC','MBA','NP-C','CCRN','AGPCNP-BC','APRN','PMH-NP',
'CHSOS','MPH','Chair','Dean','President','Associate Dean'];

/*

Utility function to remove extra words/titles from a persons name

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