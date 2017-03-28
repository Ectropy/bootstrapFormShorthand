(function(window){
    'use strict;'

    $("#shorthand").on("input propertychange click", function() {

        //================== PARSING INPUT ==================

        //split on new lines
        var elements = $("#shorthand").val().split("\n")

        //ignore any empty lines, because these are ignored in our shorthand
        while (elements.indexOf("") != -1) {
            var index = elements.indexOf("")
            elements.splice(index, 1);
        }

        for (i = 0; i < elements.length; i++) {

            //determine last char in the element
            var lastchar = elements[i].substr(elements[i].length - 1)

            //if the last char is a <, then this is a span element opener
            if (lastchar == "<"){
                //remove the <
                elements[i] = "open>>> " + elements[i].substr(0, elements[i].length - 1)
                //split on bars (some span elements have arguments)
                elements[i] = elements[i].split("|");

            }
            //if the last chat is a >, then this is a span element close
            else if (lastchar == ">"){
                //insert array of length 1
                elements[i] = ["close>>>"];
            }
            //otherwise it's a normal element
            else{
                //split on bars
                elements[i] = elements[i].split("|");
            }
        }

        //================== /PARSING INPUT ==================

        //At this point, the shortcode has been completely parsed.
        //Now to convert it to HTML and ajax.

        //mode can be "regular" or "span".
        var mode = "regular";

        //populate html and ajax with their starting contents
        var html = ''
        html +='<form class="form-horizontal">\n\n';

        var ajax = '';
        ajax +='//This is an Immediately Invoked Function Expression (IIFE) that wraps all of\n'
        ajax +='//the code and accepts the window object as an argument.\n'
        ajax +='(function(window){\n'
        ajax +='\'use strict\'\n';
        ajax +='\n';
        ajax +='//Handles detection of submit button click.\n'
        ajax +='$("#btnSubmit").on("click", function(){\n'
        ajax +='    var errors = ""\n\n'

        ajaxreader = ''
        ajaxvalidation = ''
        ajaxdata = ''
        ajaxcleaner = ''

        var label = ''
        var elemlabel = ''
        var id = ''
        var placeholder = ''
        var name = ''
        var value = ''

        console.log(elements);

        for (var i = 0; i < elements.length; i++) {
            label = ''
            elemlabel = ''
            id = ''
            placeholder = ''
            name = ''
            value = ''

            if (elements[i][0].split(' ')[0] === "open>>>"){
                //console.log(elements[i][0].split(' ')[0]);
                console.log("span mode triggered");
                mode = "span";
            }
            else {
                console.log("regular mode triggered");
                mode = "regular";
            }

            if (mode === "regular"){

                switch(elements[i][0]) {
                    case "input-text":
                        label = elements[i][1];
                        id = elements[i][2];
                        placeholder = elements[i][3]
                        console.log('Building input-text with label "'+label+'"...');

                        html +='    <div class="form-group">\n';
                        html +='        <label for="'+id+'" class="col-sm-3 control-label">'+label+'</label>\n';
                        html +='        <div class="col-sm-9">\n';
                        html +='            <input class="form-control" id="'+id+'" placeholder="'+placeholder+'" type="text">\n';
                        html +='        </div>\n';
                        html +='    </div>\n\n';

                        ajaxreader +=      '    var '+id+' = $("#'+id+'").val();\n'

                        ajaxvalidation +=  '    if ('+id+' === ""){\n'
                        ajaxvalidation +=  '        errors += "'+label+' is a required field.<br>";\n'
                        ajaxvalidation +=  '    }\n'
                        ajaxvalidation +=  '    if ('+id+'.length > 200){\n'
                        ajaxvalidation +=  '        errors += "'+label+' is too long.<br>";\n'
                        ajaxvalidation +=  '    }\n'

                        ajaxdata +=        '            '+id+' : '+id+',\n'

                        ajaxcleaner +=     '                $("#'+id+'").val("");\n'
                        break;

                    case "textarea":
                        label = elements[i][1];
                        id = elements[i][2];
                        placeholder = elements[i][3]
                        numOfRows = elements[i][4]

                        html +='    <div class="form-group">\n';
                        html +='        <label for="'+id+'" class="col-sm-3 control-label">'+label+'</label>\n';
                        html +='        <div class="col-sm-9">\n';
                        html +='            <textarea class="form-control" id="'+id+'" placeholder="'+placeholder+'" rows="'+numOfRows+'"></textarea>\n';
                        html +='        </div>\n';
                        html +='    </div>\n\n';

                        ajaxreader +=      '    var '+id+' = $("#'+id+'").val();\n'

                        ajaxvalidation +=  '    if ('+id+' === ""){\n'
                        ajaxvalidation +=  '        errors += "'+label+' is a required field.<br>";\n'
                        ajaxvalidation +=  '    }\n'
                        ajaxvalidation +=  '    if ('+id+'.length > 200){\n'
                        ajaxvalidation +=  '        errors += "'+label+' is too long.<br>";\n'
                        ajaxvalidation +=  '    }\n'

                        ajaxdata +=        '            '+id+' : '+id+',\n'

                        ajaxcleaner +=     '                $("#'+id+'").val("");\n'
                        break;
                }

            }
            else if (mode === "span") {
                switch (elements[i][0]) {

                    //========================= RADIOS =========================
                    case "open>>> radios":
                        //read args for radio group's label & name.
                        label = elements[i][1];
                        name = elements[i][2];
                        console.log('Building radio group with name "'+name+'"...');


                        html +='    <div class="form-group">\n'
                        html +='        <label for="'+name+'" class="col-sm-3 control-label">'+label+'</label>\n'
                        html +='        <div class="col-sm-9">\n'

                        i++;
                        while (elements[i][0] !== "close>>>"){
                            elemlabel = elements[i][0]
                            id = elements[i][1]
                            value = elements[i][2]

                            html +='            <div class="radio">\n'
                            html +='                <label>\n'
                            html +='                    <input type="radio" name="'+name+'" id="'+id+'" value="'+value+'">\n'
                            html +='                    '+elemlabel+'\n'
                            html +='                </label>\n'
                            html +='            </div>\n'

                            i++;
                        }

                        html +='        </div>\n' //.col-sm-
                        html +='    </div>\n\n' //form-group


                        ajaxreader +=      '    var '+name+' = $("input[type=\'radio\'][name=\''+name+'\']:checked").val();\n'

                        ajaxvalidation +=  '    if ('+name+' === null){\n'
                        ajaxvalidation +=  '        errors += "'+label+' is a required field.<br>";\n'
                        ajaxvalidation +=  '    }\n'

                        ajaxdata +=        '            '+name+' : '+name+',\n'

                        ajaxcleaner +=     '                $("input[type=\'radio\'][name=\''+name+'\']").prop("checked",false);\n'

                        break;

                    //========================= CHECKBOXES =========================
                    case "open>>> checkboxes":
                        //read args for checkbox group's label & name.
                        label = elements[i][1];
                        name = elements[i][2];
                        console.log('Building checkbox group with name "'+name+'"...');


                        html +='    <div class="form-group">\n'
                        html +='        <label for="'+name+'" class="col-sm-3 control-label">'+label+'</label>\n'
                        html +='        <div class="col-sm-9">\n'

                        i++;
                        while (elements[i][0] !== "close>>>"){
                            elemlabel = elements[i][0]
                            id = elements[i][1]
                            value = elements[i][2]

                            html +='            <div class="checkbox">\n'
                            html +='                <label>\n'
                            html +='                    <input type="checkbox" name="'+name+'" id="'+id+'" value="'+value+'">\n'
                            html +='                    '+elemlabel+'\n'
                            html +='                </label>\n'
                            html +='            </div>\n'

                            //each checkbox is considered an independent item, so the state of each should be read individually.
                            ajaxreader +=      '    var '+id+' = $("#'+id+'").is(\':checked\');\n'
                            //and sent to the server individually
                            ajaxdata +=        '            '+id+' : '+id+',\n'
                            //and cleaned up individually
                            ajaxcleaner +=     '                $("#'+id+'").prop("checked",false);\n'
                            //(no clientside validation is used, since checkboxes can only be true or false)

                            i++;
                        }

                        html +='        </div>\n' //.col-sm-
                        html +='    </div>\n\n' //form-group

                        break;

                    //========================= SELECT =========================
                    case "open>>> select":
                        //read args for select's label and id
                        label = elements[i][1];
                        id = elements[i][2];
                        console.log('Building select...');


                        html +='    <div class="form-group">\n'
                        html +='        <label for="'+id+'" class="col-sm-3 control-label">'+label+'</label>\n'
                        html +='        <div class="col-sm-9">\n'
                        html +='            <select class="form-control" id="'+id+'">\n'
                        html +='            <option value="" disabled selected style="display:none;">Select an option</option>\n'

                        i++;

                        while (elements[i][0] !== "close>>>"){
                            label = elements[i][0]
                            value = elements[i][1]

                            html +='            <option value="'+value+'">'+label+'</option>\n'
                            i++;

                        }

                        html +='            </select>\n' //select
                        html +='        </div>\n' //.col-sm-
                        html +='    </div>\n\n' //form-group

                        ajaxreader +=      '    var '+id+' = $("#'+id+'").val();\n'

                        ajaxvalidation +=  '    if ('+id+' === ""){\n'
                        ajaxvalidation +=  '        errors += "'+label+' is a required field.<br>";\n'
                        ajaxvalidation +=  '    }\n'

                        ajaxdata +=        '            '+id+' : '+id+',\n'

                        ajaxcleaner +=     '                $("#'+id+'").val("");\n'

                        break;
                }
            }
        }

        console.log(elements);


        //The boilderplate end of the html.
        html +='</form>\n\n'
        html +='<div class="col-sm-12 text-center">\n'
        html +='    <button class="btn btn-lg btn-primary" id="btnSubmit">Submit</button>\n'
        html +='</div>\n'

        //Combine dynamically generated ajax with boilerplate ajax.
        var ajaxfinal = "";
        ajaxfinal += ajax
        ajaxfinal +=   '    //Load values from form fields.\n'
        ajaxfinal += ajaxreader + '\n'
        ajaxfinal +=   '    //Clientside validation. Check for null on selects, check for empty string on text inputs\n'
        ajaxfinal += ajaxvalidation + '\n'
        ajaxfinal +=   '    //If there are no clientside errors, proceed with submission.\n'
        ajaxfinal +=   '    if (errors === ""){\n\n'
        ajaxfinal +=   '    $.ajax({\n'
        ajaxfinal +=   '        type: "POST",\n'
        ajaxfinal +=   '        url: "server/index.cfc",\n'
        ajaxfinal +=   '        data: {\n'
        ajaxfinal +=   '            method : "submitForm",\n'
        ajaxfinal += ajaxdata.substr(0, ajaxdata.length - 2) //remove the last comma from the ajax data (and incidentally also the newline char)
        ajaxfinal +=   '\n'
        ajaxfinal +=   '        }\n'
        ajaxfinal +=   '    })\n'
        ajaxfinal +=   '    .done( //the "done" promise occurs when the ajax request succeeded.\n'
        ajaxfinal +=   '        function(response) {\n'
        ajaxfinal +=   '            if (response == "success"){\n'
        ajaxfinal +=   '                //Put all form fields back to empty state.\n'
        ajaxfinal += ajaxcleaner + '\n';
        ajaxfinal +=   '                bootbox.dialog({\n'
        ajaxfinal +=   '                    closeButton: false,\n'
        ajaxfinal +=   '                    title: "Success",\n'
        ajaxfinal +=   '                    message: "The form has been submitted successfully!",\n'
        ajaxfinal +=   '                    buttons: {\n'
        ajaxfinal +=   '                        main:{\n'
        ajaxfinal +=   '                            label: "Ok",\n'
        ajaxfinal +=   '                            className: "btn-primary"\n'
        ajaxfinal +=   '                        }\n'
        ajaxfinal +=   '                    }\n'
        ajaxfinal +=   '                });\n'
        ajaxfinal +=   '            }\n'
        ajaxfinal +=   '            else {\n'
        ajaxfinal +=   '                bootbox.dialog({\n'
        ajaxfinal +=   '                    closeButton: false,\n'
        ajaxfinal +=   '                    title: "Something went wrong.",\n'
        ajaxfinal +=   '                    message: "Oops! We found the following problems with the responses that you provided: <br>" + response,\n'
        ajaxfinal +=   '                    buttons: {\n'
        ajaxfinal +=   '                        main:{\n'
        ajaxfinal +=   '                        label: "Ok",\n'
        ajaxfinal +=   '                        className: "btn-primary"\n'
        ajaxfinal +=   '                        }\n'
        ajaxfinal +=   '                    }\n'
        ajaxfinal +=   '                });\n'
        ajaxfinal +=   '            }\n'
        ajaxfinal +=   '        }\n'
        ajaxfinal +=   '    )\n'
        ajaxfinal +=   '    .fail( //the "fail" promise occurs when the ajax request failed.\n'
        ajaxfinal +=   '        function() {\n'
        ajaxfinal +=   '            bootbox.dialog({\n'
        ajaxfinal +=   '                closeButton: false,\n'
        ajaxfinal +=   '                title: "Something went wrong.",\n'
        ajaxfinal +=   '                message: "We were unable to contact the server. Please try again later.",\n'
        ajaxfinal +=   '                buttons: {\n'
        ajaxfinal +=   '                    main:{\n'
        ajaxfinal +=   '                    label: "Ok",\n'
        ajaxfinal +=   '                    className: "btn-primary"\n'
        ajaxfinal +=   '                    }\n'
        ajaxfinal +=   '                }\n'
        ajaxfinal +=   '            });\n'
        ajaxfinal +=   '        }\n'
        ajaxfinal +=   '    );\n'
        ajaxfinal +=   '    } //end errors if\n'
        ajaxfinal +=   '    else{\n'
        ajaxfinal +=   '        errors += "<br>Please check your input and try submitting this form again.";\n'
        ajaxfinal +=   '        bootbox.dialog({\n'
        ajaxfinal +=   '            closeButton: false,\n'
        ajaxfinal +=   '            title: "Something went wrong.",\n'
        ajaxfinal +=   '            message: "Oops! We found the following problems with the responses that you provided:<br><br>" + errors,\n'
        ajaxfinal +=   '            buttons: {\n'
        ajaxfinal +=   '                main:{\n'
        ajaxfinal +=   '                label: "Ok",\n'
        ajaxfinal +=   '                className: "btn-primary"\n'
        ajaxfinal +=   '                }\n'
        ajaxfinal +=   '            }\n'
        ajaxfinal +=   '        });\n'
        ajaxfinal +=   '    }\n'
        ajaxfinal +=   '});\n'
        ajaxfinal +=   '})(window); //Give the IIFE window object as an argument.'


        //Display the transpiled code
        $("#htmlresults").val(html);
        $("#ajaxresults").val(ajaxfinal);
        $("#formpreview").html(html);

    })

})(window);
