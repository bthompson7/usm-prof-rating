//watch mainstreet for elements that appear
//currently this gets the first professor in the course list
var collegeName = "University+of+Southern+Maine"

new MutationObserver(function(mutations) {

            for(let mutation of mutations) {

                 
               

                for(let node of mutation.addedNodes) {
                        //for some reason mainestreet is inside an iframe so we have to do this to get the iframe content
                        //credit: https://stackoverflow.com/questions/1088544/get-element-from-within-an-iframe
                        var iframe = document.querySelector("#ptifrmtgtframe");
                        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

                        var titleElement = innerDoc.querySelector("#DERIVED_REGFRM1_UM_TITLE1")
                        var dummyElement = innerDoc.querySelector("#RMP-DUMMY-ELEMENT")

                        if(innerDoc.querySelector("#MTG_INSTR\\$0") && dummyElement == null){
                            var numOfProfessors = innerDoc.querySelectorAll("[id^=MTG_INSTR]");
                            for(var i =0; i < numOfProfessors.length; i++){
                                var element = innerDoc.querySelectorAll("[class^=rmp-rating]");
                                var currElement = numOfProfessors[i];
                                var professorName = currElement.innerHTML;
                                var splitName = professorName.split(" ");
                                searchForProfessor(splitName[0],splitName[splitName.length - 1],collegeName,currElement); 
                            }

                            titleElement.insertAdjacentHTML('afterend', '<p id="RMP-DUMMY-ELEMENT">..</p>');

                        }
                    }
                }
        }).observe(document, {subtree: true, childList: true});