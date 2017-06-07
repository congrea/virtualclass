this["JST"] = this["JST"] || {};

this["JST"]["templates/appTools.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"virtualclassOptionsCont\" style=\"z-index: 100;\">\n  <div class=\"appOptions\" id=\"virtualclassVideoTool\">\n    <a class=\"tooltip\" data-title=\"Share Video\" href=\"#\"><span class=\"icon-videoUpload\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassPollTool\">\n    <a class=\"tooltip\" data-title=\"Poll\" href=\"#\"><span class=\"icon-poll\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassQuizTool\">\n    <a class=\"tooltip\" data-title=\"Quiz\" href=\"#\"><span class=\"icon-quiz\"></span></a>\n  </div>\n\n  <div class=\"appOptions active\" id=\"virtualclassEditorRichTool\">\n    <a class=\"tooltip\" data-title=\"Text Editor\" href=\"#\"><span class=\"icon-editorRich\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassWhiteboardTool\">\n    <a class=\"tooltip\" data-doc=\"_doc0_0\" data-title=\"Whiteboard\" href=\"#\"><span class=\"icon-whiteboard\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassScreenShareTool\">\n    <a class=\"tooltip\" data-title=\"Screen Share\" href=\"#\"><span class=\"icon-screenshare\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassYtsTool\">\n    <a class=\"tooltip\" data-title=\"YouTube Video Share\" href=\"#\"><span class=\"icon-youtubeshare\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassEditorCodeTool\">\n    <a class=\"tooltip\" data-title=\"Code Editor\" href=\"#\"><span class=\"icon-editorCode\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassSharePresentationTool\">\n    <a class=\"tooltip\" data-title=\"share presentation\" href=\"#\"><span class=\"icon-sharePresentation\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassDocumentShareTool\">\n    <a class=\"tooltip\" data-title=\"Document Sharing\" href=\"#\"><span class=\"icon-documentShare\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassSessionEndTool\">\n    <a class=\"tooltip\" data-title=\"Close Session.\" href=\"#\"><span class=\"icon-sessionend\"></span></a>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/audioWidget.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"audioWidget\">\n  <div id=\"mainAudioPanel\">\n    <div id=\"speakerPressOnce\" class=\""
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\" data-audio-playing="
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"dap",{"name":"getString","hash":{},"data":data}))
    + ">\n      <a id=\"speakerPressonceAnch\" class=\"tooltip\" data-title=\""
    + alias4(((helper = (helper = helpers.audio_tooltip || (depth0 != null ? depth0.audio_tooltip : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"audio_tooltip","hash":{},"data":data}) : helper)))
    + "\" name=\"speakerPressonceAnch\">\n        <span id=\"speakerPressonceLabel\" class=\"silenceDetect\" data-silence-detect=\"stop\"> <i> </i> </span>\n      </a>\n    </div>\n\n    <div id=\"videoPacketInfo\">\n      <span id=\"videoSpeed\">\n      <span id=\"videSpeedNumber\" class=\"suggestion tooltip\" data-suggestion=\""
    + alias4(((helper = (helper = helpers.suggestion || (depth0 != null ? depth0.suggestion : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"suggestion","hash":{},"data":data}) : helper)))
    + "\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"proposedspeed",{"name":"getString","hash":{},"data":data}))
    + "\"> </span>\n      <span id=\"videLatency\" class=\"latency  tooltip\" data-latency=\""
    + alias4(((helper = (helper = helpers.latency || (depth0 != null ? depth0.latency : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latency","hash":{},"data":data}) : helper)))
    + "\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"audiolatency",{"name":"getString","hash":{},"data":data}))
    + "\">  </span>\n      <span id=\"videoFrameRate\" class=\"quality  tooltip\" data-quality=\""
    + alias4(((helper = (helper = helpers.quality || (depth0 != null ? depth0.quality : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quality","hash":{},"data":data}) : helper)))
    + "\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"videoquality",{"name":"getString","hash":{},"data":data}))
    + "\"> </span>\n      </span>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/documentSharing/docsMain.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "        <div id=\"docsListContainer\">\n          <div id=\"newdocsBtnCont\">\n            <button id=\"newDocBtn\">Upload Documents</button>\n          </div>\n          <div id=\"listdocs\" class=\"listPages pages\"></div>\n        </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "        <span id=\"docMsgStudent\">There might be share the Docs</span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"virtualclassDocumentShare\" class=\"virtualclass container\" data-screen=\"1\">\n  <div id=\"docsPopupCont\" class=\"bootstrap\"></div>\n  <div id=\"documentScreen\" class=\"container\">\n    <div id=\"docScreenContainer\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["templates/documentSharing/docsNav.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"link"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + " links\" id=\"link"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + " \" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-selected=\"0\" data-status=\"1\">\n  <div class=\"mainpreview tooltip2\" id=\"mainpdocs"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n  <div id=\"controlCont"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" class=\"controlCont\">\n    <div class=\"controls status\" data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\">\n      <a class=\"statusanch\">"
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "</a>\n    </div>\n    <div class=\"controls delete\">\n      <a class=\"deleteanch\">delete</a>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/documentSharing/notesMain.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <div id=\"note"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"note\" data-slide=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-status="
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + " >\n    <div class=\"imageContainer\">\n      <img src= "
    + alias4(((helper = (helper = helpers.content_path || (depth0 != null ? depth0.content_path : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content_path","hash":{},"data":data}) : helper)))
    + " />\n    </div>\n  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.notes : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["templates/documentSharing/notesNav.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"linknotes links\" id=\"link"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-selected=\"0\"\n     data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\" draggable=\"true\">\n  <div class=\"mainpreview\" id=\"mainp"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">\n    <img class=\"thumbnail\" id=\"thumbnail"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" src=\""
    + alias4(((helper = (helper = helpers.content_path || (depth0 != null ? depth0.content_path : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content_path","hash":{},"data":data}) : helper)))
    + "\">\n    <span class=\"thumbList tooltip2\" data-title=\""
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.thumbCount || (depth0 != null ? depth0.thumbCount : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"thumbCount","hash":{},"data":data}) : helper)))
    + "</span>\n  </div>\n  <div id=\"controlCont"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"controlCont\">\n    <div class=\"controls status\" data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\">\n      <a class=\"statusanch\">status"
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "</a>\n    </div>\n    <div class=\"controls delete\">\n      <a class=\"deleteanch\">delete</a>\n    </div>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["templates/documentSharing/screen.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "        <span class=\"nvgt prev\" id=\"docsprev\"></span>\n        <span class=\"nvgt next\" id=\"docsnext\"></span>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <div id=\"listnotes\" class=\"listPages pages\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"screen-docs\" data-doc=\""
    + alias4(((helper = (helper = helpers.cd || (depth0 != null ? depth0.cd : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cd","hash":{},"data":data}) : helper)))
    + "\" class=\"screen page_wrapper current\">\n  "
    + alias4(((helper = (helper = helpers.debug || (depth0 != null ? depth0.debug : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"debug","hash":{},"data":data}) : helper)))
    + "\n  <div class=\"pageContainer\">\n    <div id=\"notesContainer\" class=\"notes\">\n"
    + ((stack1 = container.invokePartial(partials.docNotesMain,depth0,{"name":"docNotesMain","data":data,"indent":"      ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "    </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControls : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControls : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n\n";
},"usePartial":true,"useData":true});

this["JST"]["templates/leftBar.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.recordingControl,depth0,{"name":"recordingControl","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.appTools,depth0,{"name":"appTools","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"virtualclassAppLeftPanel\" class=\"leftbar\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isPlay : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControl : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  <div id=\"virtualclassWhiteboard\" class=\"virtualclass\"></div>\n</div>";
},"usePartial":true,"useData":true});

this["JST"]["templates/main.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.precheck,depth0,{"name":"precheck","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "<div id=\"virtualclassApp\" style=\"display: block;\">\n"
    + ((stack1 = container.invokePartial(partials.rightBar,depth0,{"name":"rightBar","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.leftBar,depth0,{"name":"leftBar","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.popupCont,depth0,{"name":"popupCont","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>";
},"usePartial":true,"useData":true});

this["JST"]["templates/popupCont.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"popupContainer\">\n  <div id=\"about-modal\" class=\"rv-vanilla-modal\">\n    <div id=\"recordingContainer\" class=\"popupWindow\">\n      <div class=\"rv-vanilla-modal-header group\" id=\"recordingHeaderContainer\">\n        <h2 class=\"rv-vanilla-modal-title\" id=\"recordingHeader\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"uploadsession",{"name":"getString","hash":{},"data":data}))
    + "</h2>\n      </div>\n\n      <div class=\"rv-vanilla-modal-body\">\n        <div id=\"progressContainer\">\n          <div id=\"totProgressCont\">\n            <div id=\"totalProgressLabel\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"totalprogress",{"name":"getString","hash":{},"data":data}))
    + " </div>\n            <div id=\"progress\">\n              <div id=\"progressBar\" class=\"progressBar\"></div>\n              <div id=\"progressValue\" class=\"progressValue\"> 0%</div>\n            </div>\n          </div>\n\n          <div id=\"indvProgressCont\">\n            <div id=\"indvProgressLabel\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"indvprogress",{"name":"getString","hash":{},"data":data}))
    + " </div>\n            <div id=\"indProgress\">\n              <div id=\"indProgressBar\" class=\"progressBar\"></div>\n              <div id=\"indProgressValue\" class=\"progressValue\"> 0%</div>\n            </div>\n          </div>\n        </div>\n\n        <div id=\"recordFinishedMessageBox\">\n          <span id=\"recordFinishedMessage\">  "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"uploadedsession",{"name":"getString","hash":{},"data":data}))
    + " </span>\n          <span id=\"recordingClose\" class=\"icon-close\"></span>\n        </div>\n      </div>\n    </div>\n\n    <div id=\"recordPlay\" class=\"popupWindow\">\n      <div class=\"rv-vanilla-modal-body\">\n\n        <div id=\"downloadPcCont\">\n          <div id=\"downloadSessionText\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"downloadsession",{"name":"getString","hash":{},"data":data}))
    + "</div>\n          <div id=\"downloadPrgressLabel\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"overallprogress",{"name":"getString","hash":{},"data":data}))
    + " </div>\n          <div id=\"downloadProgress\">\n            <div id=\"downloadProgressBar\" class=\"progressBar\"></div>\n            <div id=\"downloadProgressValue\" class=\"progressValue\"> 0% </div>\n          </div>\n        </div>\n\n        <div id=\"askPlay\">\n          <div id=\"askplayMessage\"> </div>\n          <button id=\"playButton\" class=\"icon-play\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"play",{"name":"getString","hash":{},"data":data}))
    + "</button>\n        </div>\n\n      </div>\n    </div>\n\n    <div id=\"replayContainer\" class=\"popupWindow\">\n      <p id=\"replayMessage\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"replay_message",{"name":"getString","hash":{},"data":data}))
    + "</p>\n      <div id=\"replayClose\" class=\"close icon-close\"></div>\n      <button id=\"replayButton\" class=\"icon-repeat\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"replay",{"name":"getString","hash":{},"data":data}))
    + " </button>\n    </div>\n\n    <div id=\"confirm\" class=\"popupWindow simple-box\"></div>\n\n    <div id=\"sessionEndMsgCont\" class=\"popupWindow\">\n      <span id=\"sessionEndClose\" class=\"icon-close\"></span>\n      <span id=\"sessionEndMsg\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"sessionendmsg",{"name":"getString","hash":{},"data":data}))
    + " </span>\n    </div>\n\n    <div id=\"waitMsgCont\" class=\"popupWindow\">\n      <span id=\"waitMsg\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"waitmsgconnect",{"name":"getString","hash":{},"data":data}))
    + " </span>\n    </div>\n\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/precheck.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"virtualclassPreCheck\"  class=\"bootstrap\">\n  <div id=\"preCheckcontainer\">\n    <div class=\"container  \">\n      <!-- Modal -->\n      <div class=\"modal fade\" id=\"myModal\" role=\"dialog\">\n        <div class=\"modal-dialog modal-lg\">\n          <!-- Modal content-->\n          <div class=\"modal-content\">\n            <div class=\"modal-body\">\n              <div id=\"preCheckProgress\">\n                <ul class=\"progressbar\" id=\"congProgressbar\">\n                  <li class=\"screen1 browser active\"></li>\n                  <li class=\"screen2 bandwidth\"></li>\n                  <li class=\"screen5 speaker\"></li>\n                  <li class=\"screen4 mic\"></li>\n                  <li class=\"screen3 webcam\"></li>\n                </ul>\n              </div>\n\n              <div id=\"vcBrowserCheck\" class=\"precheck browser\">\n                <div class=\"testName\"> "
    + alias4(((helper = (helper = helpers.testingbrowser || (depth0 != null ? depth0.testingbrowser : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testingbrowser","hash":{},"data":data}) : helper)))
    + "  </div>\n                <!-- <div class=\"progress\"> Progressing .... </div> -->\n                <div class=\"result\"></div>\n                <div id=\"browserButtons\" class=\"button clearfix\">\n                  <button type=\"button\" class=\"next btn btn-default\">Next</button>\n                </div>\n              </div>\n\n              <div id=\"vcBandWidthCheck\" class=\"precheck bandwidth\">\n                <div class=\"testName\"> "
    + alias4(((helper = (helper = helpers.testinginternetspeed || (depth0 != null ? depth0.testinginternetspeed : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testinginternetspeed","hash":{},"data":data}) : helper)))
    + " </div>\n                <!-- <div class=\"progress\"> Progressing....</div> -->\n                <div class=\"result\"><img src=\""
    + alias4(((helper = (helper = helpers.whiteboardPath || (depth0 != null ? depth0.whiteboardPath : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"whiteboardPath","hash":{},"data":data}) : helper)))
    + "images/progressbar.gif\" /></div>\n                <div id=\"bandwidthButtons\" class=\"button clearfix\">\n                  <button type=\"button\" class=\"prev btn btn-default\">Prev</button>\n                  <button type=\"button\" class=\"next btn btn-default\">Next</button>\n                </div>\n              </div>\n\n              <div id=\"vcSpeakerCheck\" class=\"precheck speaker\">\n                <div class=\"testName\"> "
    + alias4(((helper = (helper = helpers.testingspeaker || (depth0 != null ? depth0.testingspeaker : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testingspeaker","hash":{},"data":data}) : helper)))
    + " </div>\n                <!-- <div class=\"progress\"> Progressing....</div> -->\n                <audio id=\"vcSpeakerCheckAudio\">\n                  <source src=\""
    + alias4(((helper = (helper = helpers.whiteboardPath || (depth0 != null ? depth0.whiteboardPath : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"whiteboardPath","hash":{},"data":data}) : helper)))
    + "audio/audio_music.ogg\">\n                  <source src=\""
    + alias4(((helper = (helper = helpers.whiteboardPath || (depth0 != null ? depth0.whiteboardPath : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"whiteboardPath","hash":{},"data":data}) : helper)))
    + "audio/audio-music.mp3\">\n                </audio>\n\n                <div class=\"result\"></div>\n\n                <div id=\"speakerButtons\" class=\"button clearfix\">\n                  <button type=\"button\" class=\"prev btn btn-default\">Prev</button>\n                  <button type=\"button\" class=\"next btn btn-default\">Next</button>\n                </div>\n              </div>\n\n              <div id=\"vcMicCheck\" class=\"precheck mic\">\n                <div class=\"testName\"> "
    + alias4(((helper = (helper = helpers.testingmichrophone || (depth0 != null ? depth0.testingmichrophone : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testingmichrophone","hash":{},"data":data}) : helper)))
    + "</div>\n                <!-- <div class=\"progress\"> Progressing....</div> -->\n                <div id=\"audioVisualaizerCont\">\n                  <canvas id=\"audioVisualaizer\" class=\"visualizer\" width=\"60\"></canvas>\n                </div>\n\n                <div class=\"result\"></div>\n\n                <div id=\"micButtons\" class=\"button clearfix\">\n                  <button type=\"button\" class=\"prev btn btn-default\">Prev</button>\n                  <button type=\"button\" class=\"next btn btn-default\">Next</button>\n                </div>\n              </div>\n\n              <div id=\"vcWebCamCheck\" class=\"precheck webcam\">\n                <div class=\"testName\">  "
    + alias4(((helper = (helper = helpers.testingwebcam || (depth0 != null ? depth0.testingwebcam : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"testingwebcam","hash":{},"data":data}) : helper)))
    + " </div>\n                <!-- <div class=\"progress\"> Progressing....</div> -->\n                <div id=\"webcamTempVideoCon\">\n                  <video id=\"webcamTempVideo\"></video>\n                </div>\n\n                <div class=\"result\"></div>\n\n                <div id=\"joinSession\" class=\"button clearfix\">\n                  <button type=\"button\" class=\"prev btn btn-default\">Prev</button>\n                  <button type=\"button\" class=\"next btn btn-default\">Join Session</button>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/recordingControl.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"playControllerCont\">\n  <div id=\"playController\">\n    <div id=\"recPlayCont\" class=\"recButton\"> <button id=\"recPlay\" class=\"icon-play tooltip\" data-title=\"Play\"></button></div>\n    <div id=\"recPauseCont\" class=\"recButton \"> <button id=\"recPause\" class=\"icon-pause tooltip\" data-title=\"Pause\"></button></div>\n    <div id=\"ff2Cont\" class=\"recButton\"> <button id=\"ff2\" class=\"ff icon-forward tooltip\" data-title=\"Fast Forward 2\"></button></div>\n    <div id=\"ff8Cont\" class=\"recButton\"> <button id=\"ff8\" class=\"ff icon-fast-forward tooltip\" data-title=\"Fast Forward 8\"></button></div>\n    <div id=\"playProgress\"> <div id=\"playProgressBar\" class=\"progressBar\" style=\"width: 0%;\"></div> </div>\n    <div id=\"repTimeCont\"> <span id=\"tillRepTime\">00:00</span> / <span id=\"totalRepTime\">00:00</span> </div>\n  </div>\n  <div id=\"replayFromStart\"> <button  class=\"ff icon-Replayfromstart tooltip\" data-title=\"Replay from Start.\"></button> </div>\n</div>";
},"useData":true});

this["JST"]["templates/rightBar.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"virtualclassAppRightPanel\" class=\"rightbar\">\n"
    + ((stack1 = container.invokePartial(partials.audioWidget,depth0,{"name":"audioWidget","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.teacherVideo,depth0,{"name":"teacherVideo","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  <div id=\"chatWidget\">\n    <div id=\"stickycontainer\"></div>\n    <div id=\"congreaChatCont\"></div>\n  </div>\n</div>";
},"usePartial":true,"useData":true});

this["JST"]["templates/teacherVideo.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    <video id=\"videoHostSource\" autoplay=\"\"></video>\n    <canvas id=\"videoHost\"></canvas>\n    <canvas id=\"videoHostSlice\"></canvas>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <div id=\"fromServer\">\n      <canvas id=\"videoParticipate\" > </canvas>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"videoHostContainer\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.hasControl : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\n\n";
},"useData":true});

this["JST"]["templates/whiteboard/main.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.whiteboardToolbar,depth0,{"name":"whiteboardToolbar","data":data,"indent":"      ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"vcanvas"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"vcanvas socketon\" data-wb-id=\""
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\">\r\n  <div id=\"containerWb"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"containerWb\">\r\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControl : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      <div id=\"canvasWrapper"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\">\r\n      <canvas id=\"canvas"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\" width=\"730\" height=\"750\">\r\n        Canvas is missing in your browsers. Please update the latest version of your browser\r\n      </canvas>\r\n    </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true});

this["JST"]["templates/whiteboard/toolbar.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"commandToolsWrapper"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"commandToolsWrapper\">\n  <div id=\"t_rectangle"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"rectangle\">\n    <a href=\"#\" data-title=\"Rectangle\" class=\"tooltip\"><span class=\"icon-rectangle\"></span></a>\n  </div>\n\n  <div id=\"t_line"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"line\">\n    <a href=\"#\" data-title=\"Line\" class=\"tooltip\"> <span class=\"icon-line\"></span></a>\n  </div>\n\n  <div id=\"t_freeDrawing"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"freeDrawing\">\n    <a href=\"#\" data-title=\"Free hand\" class=\"tooltip\">\n      <span class=\"icon-freeDrawing\"></span>\n    </a>\n  </div>\n\n  <div id=\"t_oval"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"oval\">\n    <a href=\"#\" data-title=\"Oval\" class=\"tooltip\">\n      <span class=\"icon-oval\"></span>\n    </a>\n  </div>\n\n  <div id=\"t_triangle"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"triangle\">\n    <a href=\"#\" data-title=\"Triangle\" class=\"tooltip\">\n      <span class=\"icon-triangle\"></span>\n    </a>\n  </div>\n\n  <div id=\"t_text"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"text\"><a href=\"#\" data-title=\"Text\" class=\"tooltip\">\n    <span class=\"icon-text\"></span></a>\n  </div>\n\n  <div id=\"t_activeall"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"activeAll\">\n    <a href=\"#\" data-title=\"Active All\" class=\"tooltip\">\n      <span class=\"icon-activeAll\"></span>\n    </a>\n  </div>\n\n  <div id=\"t_clearall"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"clearAll\">\n    <a href=\"#\" data-title=\"Clear All\" class=\"tooltip\">\n      <span class=\"icon-clearAll\"></span>\n    </a>\n  </div>\n</div>";
},"useData":true});