//watch mainstreet for elements that appear
//currently this gets the first professor in the course list

new MutationObserver(function(mutations) {
            for(let mutation of mutations) {
                for(let node of mutation.addedNodes) {
                        //if (!(node instanceof HTMLElement)) continue;
                        
                        //for some reason mainestreet is inside an iframe so we have to do this to get the iframe content
                        //credit: https://stackoverflow.com/questions/1088544/get-element-from-within-an-iframe
                        var iframe = document.querySelector("#ptifrmtgtframe");
                        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

                        if(innerDoc.querySelector("#MTG_INSTR\\$0")){ //if we found at least 1 professor find the rest :)
                            var numOfProfessors = innerDoc.querySelectorAll("[id^=MTG_INSTR]");
                            for(var i =0; i < numOfProfessors.length; i++){
                                var currElement = numOfProfessors[i];
                                console.log("Got prof name = " + currElement.innerHTML);
                            }
                            

                        }
                    }
                }
        }).observe(document, {subtree: true, childList: true});