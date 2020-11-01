//watch mainstreet for elements that appear
//currently this gets the first professor in the course list

new MutationObserver(function(mutations) {
            for(let mutation of mutations) {
                for(let node of mutation.addedNodes) {
                        //if (!(node instanceof HTMLElement)) continue;	// we track only elements, skip other nodes (e.g. text nodes)
                        
                        //for some reason mainestreet is inside an iframe so we have to do this to get the iframe content
                        //credit: https://stackoverflow.com/questions/1088544/get-element-from-within-an-iframe
                        var iframe = document.querySelector("#ptifrmtgtframe");
                        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

                        if(innerDoc.querySelector("#DERIVED_SSS_SCL_TITLE1\\$78\\$")){
                            console.log(innerDoc.querySelector("#DERIVED_SSS_SCL_TITLE1\\$78\\$").innerHTML);
                        }

                        if(innerDoc.querySelector("#MTG_INSTR\\$0")){
                            alert(innerDoc.querySelector("#MTG_INSTR\\$0").innerHTML);
                        }

                    }
                }
        }).observe(document, {subtree: true, childList: true});