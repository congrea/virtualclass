this["JST"] = this["JST"] || {};

this["JST"]["templates/appTools.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"virtualclassOptionsCont\" style=\"z-index: 100;\">\n  <div class=\"appOptions\" id=\"virtualclassVideoTool\">\n    <a class=\"congtooltip\" data-title=\"Share Video\" href=\"#\"><span class=\"icon-videoUpload cgIcon\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassPollTool\">\n    <a class=\"congtooltip\" data-title=\"Poll\" href=\"#\"><span class=\"icon-poll cgIcon\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassQuizTool\">\n    <a class=\"congtooltip\" data-title=\"Quiz\" href=\"#\"><span class=\"icon-quiz cgIcon\"></span></a>\n  </div>\n\n  <div class=\"appOptions active\" id=\"virtualclassEditorRichTool\">\n    <a class=\"congtooltip\" data-title=\"Text Editor\" href=\"#\"><span class=\"icon-editorRich cgIcon\"></span></a>\n  </div>\n  <div class=\"appOptions\" id=\"virtualclassWhiteboardTool\">\n    <a class=\"congtooltip\" data-doc=\"_doc0_0\" data-title=\"Whiteboard\" href=\"#\"><span class=\"icon-whiteboard cgIcon\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassScreenShareTool\">\n    <a class=\"congtooltip\" data-title=\"Screen Share\" href=\"#\"><span class=\"icon-screenshare cgIcon\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassEditorCodeTool\">\n    <a class=\"congtooltip\" data-title=\"Code Editor\" href=\"#\"><span class=\"icon-editorCode cgIcon\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassSharePresentationTool\">\n    <a class=\"congtooltip\" data-title=\"Share Presentation\" href=\"#\"><span class=\"icon-sharePresentation cgIcon\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassDocumentShareTool\">\n    <a class=\"congtooltip\" data-title=\"Document Sharing\" href=\"#\"><span class=\"icon-documentShare cgIcon\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassSessionEndTool\">\n    <a class=\"congtooltip\" data-title=\"Session End\" href=\"#\"><span class=\"icon-sessionend cgIcon\"></span></a>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/appToolsMeeting.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"virtualclassOptionsCont\" style=\"z-index: 100;\">\n  <div class=\"appOptions\" id=\"virtualclassVideoTool\">\n    <a class=\"congtooltip\" data-title=\"Share Video\" href=\"#\"><span class=\"icon-videoUpload\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassPollTool\">\n    <a class=\"congtooltip\" data-title=\"Poll\" href=\"#\"><span class=\"icon-poll\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassQuizTool\">\n    <a class=\"congtooltip\" data-title=\"Quiz\" href=\"#\"><span class=\"icon-quiz\"></span></a>\n  </div>\n\n  <div class=\"appOptions active\" id=\"virtualclassEditorRichTool\">\n    <a class=\"congtooltip\" data-title=\"Text Editor\" href=\"#\"><span class=\"icon-editorRich\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassWhiteboardTool\">\n    <a class=\"congtooltip\" data-doc=\"_doc0_0\" data-title=\"Whiteboard\" href=\"#\"><span class=\"icon-whiteboard\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassScreenShareTool\">\n    <a class=\"congtooltip\" data-title=\"Screen Share\" href=\"#\"><span class=\"icon-screenshare\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassEditorCodeTool\">\n    <a class=\"congtooltip\" data-title=\"Code Editor\" href=\"#\"><span class=\"icon-editorCode\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassSharePresentationTool\">\n    <a class=\"congtooltip\" data-title=\"share presentation\" href=\"#\"><span class=\"icon-sharePresentation\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassDocumentShareTool\">\n    <a class=\"congtooltip\" data-title=\"Document Sharing\" href=\"#\"><span class=\"icon-documentShare\"></span></a>\n  </div>\n\n  <div class=\"appOptions\" id=\"virtualclassMultiVideoTool\">\n      <a class=\"congtooltip\" data-title=\"Video Confrence\" href=\"#\"><span class=\"icon-videoConfrence\"></span></a>\n  </div>\n\n\n  <div class=\"appOptions\" id=\"virtualclassSessionEndTool\" data-meeting=\""
    + alias4(((helper = (helper = helpers.bogati || (depth0 != null ? depth0.bogati : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"bogati","hash":{},"data":data}) : helper)))
    + "\">\n    <a class=\"congtooltip\" data-title=\""
    + alias4(((helper = (helper = helpers.bogati || (depth0 != null ? depth0.bogati : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"bogati","hash":{},"data":data}) : helper)))
    + "\" href=\"#\"><span class=\"icon-sessionend\"></span></a>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["templates/audioWidget.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "      <li class=\"videoSwitchCont congtooltip\" data-title=\"Video off\" id=\"congCtrBar\">\n        <a id=\"rightCtlr\">\n          <span id=\"videoSwitch\" data-action=\"disable\" class=\"video on\" ></span>\n        </a>\n      </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"audioWidget\">\n  <ul class=\"nav navbar-nav\" id=\"mainAudioPanel\">\n\n\n    <li id=\"speakerPressOnce\" class=\""
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\" data-audio-playing="
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"dap",{"name":"getString","hash":{},"data":data}))
    + ">\n      <a id=\"speakerPressonceAnch\" class=\"congtooltip\" data-title=\""
    + alias4(((helper = (helper = helpers.audio_tooltip || (depth0 != null ? depth0.audio_tooltip : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"audio_tooltip","hash":{},"data":data}) : helper)))
    + "\" data-meeting=\""
    + alias4(((helper = (helper = helpers.meetingMode || (depth0 != null ? depth0.meetingMode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"meetingMode","hash":{},"data":data}) : helper)))
    + "\" name=\"speakerPressonceAnch\">\n        <span id=\"speakerPressonceLabel\" class=\"silenceDetect cgIcon\" data-silence-detect=\"stop\"> <i> </i> </span>\n      </a>\n    </li>\n\n    <li class=\"prechk congtooltip\" data-title=\"Precheck\" id=\"precheckTest\">\n      <a><span class=\"precheck cgIcon\"  id=\"precheckSetting\" ></span></a>\n    </li>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isControl : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isMettingMode : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n    <li id=\"videSpeedNumber\" class=\"suggestion congtooltip\" data-suggestion=\""
    + alias4(((helper = (helper = helpers.suggestion || (depth0 != null ? depth0.suggestion : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"suggestion","hash":{},"data":data}) : helper)))
    + "\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"proposedspeed",{"name":"getString","hash":{},"data":data}))
    + "\"> </li>\n    <li id=\"vedioPacket\" >\n      <a id=\"videoPacketInfo\">\n        <span id=\"videLatency\" class=\"latency  congtooltip\" data-latency=\"slow\" data-title=\"slow\">  </span>\n      </a>\n    </li>\n  </ul>\n</div>";
},"useData":true});

this["JST"]["templates/chat/chatCont.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"ui-widget ui-corner-top ui-memblist\" id=\"memlist\" style=\"display: block; right: -1px; z-index: 0;\">\n  <div class=\"ui-widget-content ui-memblist-content\" id=\"yui_3_17_2_1_1496901386584_68\">\n    <div id=\"chat_div\" class=\"ui-widget-content ui-memblist-log\"\n         style=\"height: 389px; width: 320px; max-height: 429px;\">\n\n    </div>\n  </div>\n</div>\n\n<div class=\"ui-widget ui-corner-top ui-chatroom enable\" id=\"chatrm\"\n     style=\"width: 304px; left: 6px; display: none; z-index: 1;\">\n  <div class=\"ui-widget-content ui-chatbox-content\" id=\"yui_3_17_2_1_1496901386584_77\">\n    <div id=\"chat_room\" class=\"ui-widget-content ui-chatbox-log\"></div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/chat/chatMain.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"ui-widget ui-corner-top ui-memblist\" id=\"memlist\" style=\"display: block; right: -1px; z-index: 0;\">\n  <div class=\"ui-widget-content ui-memblist-content\" id=\"yui_3_17_2_1_1496901386584_68\">\n  </div>\n</div>\n<div class=\"ui-widget ui-corner-top ui-chatroom enable\" id=\"chatrm\"\n     style=\"width: 304px; left: 6px; display: none; z-index: 1;\">\n  <div class=\"ui-widget-content ui-chatbox-content\" id=\"yui_3_17_2_1_1496901386584_77\">\n    <div id=\"chat_room\" class=\"ui-widget-content ui-chatbox-log\"></div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/chat/chatbox.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li id=\"tabcb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"ui-state-default ui-corner-bottom ui-tabs-active ui-state-active\" aria-controls=\"tabcb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><a\n  href=\"#tabcb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"ui-tabs-anchor\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"adminusr",{"name":"getString","hash":{},"data":data}))
    + "</a> <a href=\"#\" role=\"button\" class=\"ui-corner-all ui-chatbox-icon\"><span\n  class=\"ui-icon icon-close\"></span></a>\n  <div class=\"ui-widget ui-corner-top ui-chatbox\" id=\"cb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" style=\"width: 230px;\">\n    <div class=\"ui-widget-header ui-corner-top ui-chatbox-titlebar ui-dialog-header\"><span>"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"adminusr",{"name":"getString","hash":{},"data":data}))
    + "</span><a href=\"#\"\n                                                                                                                class=\"ui-chatbox-icon\"\n                                                                                                                role=\"button\"><span\n      class=\"ui-icon icon-close\"></span></a><a href=\"#\" class=\"ui-chatbox-icon\" role=\"button\"><span\n      class=\"ui-icon icon-minus\"></span></a>\n    </div>\n    <div class=\"ui-widget-content ui-chatbox-content\" id=\"yui_3_17_2_1_1496992871757_60\">\n      <div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"ui-widget-content ui-chatbox-log\">\n\n      </div>\n      <div class=\"ui-widget-content ui-chatbox-input\" id=\"yui_3_17_2_1_1496992871757_59\"><textarea\n        class=\"ui-widget-content ui-chatbox-input-box\" id=\"ta"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" style=\"width: 219px;\"></textarea></div>\n    </div>\n  </div>\n</li>";
},"useData":true});

this["JST"]["templates/chat/chatcontroller.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "ControlContainer\" class=\"controls\">\n  <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAssignCont\" class=\"controleCont\">\n    <a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAssignAnch\" class=\"congtooltip\"\n       data-title=\"Transfer Controls\">\n      <span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAssignImg\" data-assign-disable=\"false\"\n            class=\"icon-assignImg enable assignImg\">\n      </span>\n    </a>\n  </div>\n  <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudCont\" class=\"controleCont\">\n    <a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudAnch\" class=\"congtooltip\" data-title=\"Mute\">\n      <span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudImg\" data-audio-disable=\"false\" class=\"icon-audioImg enable audioImg\"></span>\n    </a>\n  </div>\n  <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatCont\" class=\"controleCont\">\n    <a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatAnch\" class=\"congtooltip\" data-title=\"Disable Chat\"><span\n      id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatImg\" data-chat-disable=\"false\" class=\"icon-chatImg enable chatImg\"></span>\n    </a>\n  </div>\n  <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichCont\" class=\"controleCont controllereditorRich\" style=\"display: none;\">\n    <a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichAnch\" class=\"congtooltip\" data-title=\"Write Mode\">\n      <span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichImg\" data-editorrich-disable=\"true\"\n            class=\"icon-editorRichImg block editorRichImg\"></span>\n    </a>\n  </div>\n  <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeCont\" class=\"controleCont controllereditorCode\" style=\"display: none;\">\n    <a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeAnch\" class=\"congtooltip\" data-title=\"Write Mode\">\n          <span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeImg\" data-editorcode-disable=\"true\"\n                class=\"icon-editorCodeImg block editorCodeImg\">\n          </span>\n    </a>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/chat/chatuser.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {});

  return "    <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "ControlContainer\" class=\"controls\">\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.isTeacher : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"controleCont\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudCont\">\n          <a class=\"congtooltip\" data-title=\"Mute\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudAnch\">\n            <span class=\"icon-audioImg enable audioImg contImg\" data-audio-disable=\"false\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudImg\"></span></a>\n        </div>\n        <div class=\"controleCont\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatCont\">\n          <a class=\"congtooltip\" data-title=\"Disable Chat\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatAnch\">\n            <span class=\"icon-chatImg enable chatImg contImg\" data-chat-disable=\"false\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatImg\"></span></a>\n        </div>\n\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.isTeacher : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "           <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAssignCont\" class=\"controleCont\">\n             <a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAssignAnch\" class=\"congtooltip\" data-title=\"Transfer Controls\">\n               <span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAssignImg\" data-assign-disable=\"false\" class=\"icon-assignImg enable assignImg contImg\"></span></a>\n           </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <div class=\"controleCont controllereditorRich\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichCont\">\n          <a class=\"congtooltip\" data-title=\"Write Mode\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichAnch\">\n            <span class=\"icon-editorRichImg block editorRichImg contImg\" data-editorrich-disable=\"true\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichImg\"></span></a>\n        </div>\n        <div class=\"controleCont controllereditorCode\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeCont\" style=\"display: none;\">\n          <a class=\"congtooltip\" data-title=\"Write Mode\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeAnch\">\n            <span class=\"icon-editorCodeImg block editorCodeImg contImg\" data-editorcode-disable=\"true\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeImg\"></span></a>\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"userImg ui-memblist-usr online student media\" id=\"ml"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "\" data-role=\"student\">\n\n  <div class=\"user-details media-body congtooltip\" data-title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.name : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.lname : stack1), depth0))
    + "\">\n    <a href=\"#"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "\" class=\"pull-left\">\n      <img class=\"media-object\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.img : stack1), depth0))
    + "\">\n    </a>\n    <div class=\"usern\">\n    <a href=\"#"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "\" class=\"media-heading\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.name : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.lname : stack1), depth0))
    + "</a>\n    </div>\n\n  </div>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.notSelf : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["templates/chat/stickycont.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    <li class=\"uiMuteAll congtooltip\">\n      <a id=\"contrAudioAll\">\n          <span class=\"cgIcon\"id=\"contrAudioAllImg\" data-action=\"disable\"\n                class=\"icon-all-audio-disable cgIcon\"\n                data-title=\"Mute All\">\n          </span>\n      </a>\n    </li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<ul class=\"chatBarTab nav navbar-nav\">\n  <li class=\"vmchat_room_bt congtooltip\" data-title=\"Common Chat\" id=\"chatroom_bt2\">\n    <a class=\"inner_bt\">\n      <span id=\"chatroom_icon\"><span class=\"icon-chatroom cgIcon\"></span></span>\n      <span id=\"chatroom_text\" class=\"cgText\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Chatroom",{"name":"getString","hash":{},"data":data}))
    + "</span>\n    </a>\n  </li>\n  <li class=\"vmchat_bar_button congtooltip active\" id=\"user_list\" data-title=\"Private Chat\">\n    <a class=\"inner_bt\" id=\"yui_3_17_2_1_1496985300499_68\">\n      <span id=\"usertab_text\"><span id=\"onlineusertext\" class=\"cgText\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Pchat",{"name":"getString","hash":{},"data":data}))
    + "</span></span>\n    </a>\n  </li>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>\n<div id=\"stickybar\" class=\"maximize\" style=\"z-index: 2000;\">\n  <div id=\"tabs\" class=\"tabs-bottom ui-tabs ui-widget ui-widget-content ui-corner-all\">\n    <ul class=\"tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all\"\n        role=\"tablist\"></ul>\n  </div>\n  <div class=\"footerCtr\" id=\"congFooterCtr\">\n    <div class=\"vmchat_search\" id=\"congUserSearch\">\n      <input type=\"text\" id=\"congreaUserSearch\" class=\"search\"\n             placeholder=\"Search user\">\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/dashboard.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"congdashboard\" class=\"modal in\"  role=\"dialog\">\n  <div class=\"modal-dialog\">\n    <!-- Modal content-->\n    <div class=\"modal-content dashboardContainer\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\">&times;</button>\n        <h4 class=\"modal-title\"></h4>\n      </div>\n      <div class=\"modal-body\" >\n\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/dashboardCont.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"dashboardContainer\" class=\"bootstrap\"> </div>";
},"useData":true});

this["JST"]["templates/dashboardNav.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"dashboardnav\" class=\"navigation congtooltip\" data-title=\""
    + alias4(((helper = (helper = helpers.app || (depth0 != null ? depth0.app : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"app","hash":{},"data":data}) : helper)))
    + "\">\n  <button type=\"button\" class=\"btn btn-primary\" data-currapp=\""
    + alias4(((helper = (helper = helpers.app || (depth0 != null ? depth0.app : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"app","hash":{},"data":data}) : helper)))
    + "\"><i class=\"dashboard-icon cgIcon\"></i></button>\n</div>";
},"useData":true});

this["JST"]["templates/documentSharing/dashboard.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "      <div id=\"docsUploadMsz\" class=\"qq-gallery\">  </div>\n      <div id=\"listnotes\" class=\"listPages pages col-sm-12\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class='dbContainer' data-app=\""
    + alias3(((helper = (helper = helpers.app || (depth0 != null ? depth0.app : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"app","hash":{},"data":data}) : helper)))
    + "\" id=\"docsDbCont\">\n  <div id=\"docsListContainer\" class=\"col-sm-2\">\n    <div id=\"listdocs\" class=\"listPages pages list-group\"></div>\n    <div id=\"newdocsBtnCont\">\n      <button id=\"newDocBtn\" class=\"btn-default btn\"><span class=\"glyphicon glyphicon-upload\"></span>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Udocument",{"name":"getString","hash":{},"data":data}))
    + "</button>\n    </div>\n  </div>\n\n  <div class=\"dashboardview col-sm-10\">\n    <div id=\"docsuploadContainer\" class=\"col-sm-12\">  </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControls : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n</div>";
},"useData":true});

this["JST"]["templates/documentSharing/docsMain.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "\n        <!--<div id=\"docsListContainer\">-->\n          <!--<div id=\"newdocsBtnCont\">-->\n            <!--<button id=\"newDocBtn\">Upload Documents</button>-->\n          <!--</div>-->\n          <!--<div id=\"listdocs\" class=\"listPages pages\"></div>-->\n        <!--</div>-->\n\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "        <span id=\"docMsgStudent\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"mybsharedoc",{"name":"getString","hash":{},"data":data}))
    + "</span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"virtualclassDocumentShare\" class=\"virtualclass container\" data-screen=\"1\">\n  <div id=\"docsPopupCont\" class=\"bootstrap\"></div>\n  <div id=\"documentScreen\" class=\"container\">\n\n    <div id=\"docScreenContainer\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "    </div>\n\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["templates/documentSharing/docsNav.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"link"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + " links list-group-item\" id=\"link"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + " \" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-selected=\"0\" data-status=\"1\">\n  <div id=\"controlCont"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" class=\"controlCont\">\n    <div class=\"controls status\" data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\">\n      <a class=\"statusanch\">"
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "</a>\n    </div>\n\n    <div class=\"controls delete\">\n      <a class=\"deleteanch\"></a>\n    </div>\n  </div>\n  <div class=\"mainpreview tooltip2\" id=\"mainpdocs"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n</div>";
},"useData":true});

this["JST"]["templates/documentSharing/notesMain.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <div id=\"note"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"note\" data-slide=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\" >\n    <!-- <div class=\"imageContainer\">\n      <img src= "
    + alias4(((helper = (helper = helpers.content_path || (depth0 != null ? depth0.content_path : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content_path","hash":{},"data":data}) : helper)))
    + " />\n    </div> -->\n  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.notes : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["templates/documentSharing/notesNav.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"linknotes links col-sm-2\" id=\"link"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-selected=\"0\"\n     data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\" draggable=\"true\" >\n  <div class=\"mainpreview\" id=\"mainp"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">\n    <img class=\"thumbnail\" id=\"thumbnail"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" src=\""
    + alias4(((helper = (helper = helpers.content_path || (depth0 != null ? depth0.content_path : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content_path","hash":{},"data":data}) : helper)))
    + "\">\n  </div>\n\n  <div id=\"controlCont"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"controlCont\">\n\n    <div class=\"controls status\" data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\" title=\""
    + alias4(((helper = (helper = helpers.titleAction || (depth0 != null ? depth0.titleAction : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"titleAction","hash":{},"data":data}) : helper)))
    + "\">\n      <a class=\"statusanch\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"status",{"name":"getString","hash":{},"data":data}))
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "</a>\n    </div>\n\n    <div class=\"controls delete\" title=\"delete\">\n      <a class=\"deleteanch\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"delete",{"name":"getString","hash":{},"data":data}))
    + "</a>\n    </div>\n\n  </div>\n\n</div>\n";
},"useData":true});

this["JST"]["templates/documentSharing/screen.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "      <span class=\"nvgt prev\" id=\"docsprev\"></span>\n      <span class=\"nvgt next\" id=\"docsnext\"></span>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "-->\n    <!--<div id=\"listnotes\" class=\"listPages pages\"></div>-->\n  <!--";
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
    + "\n  </div>\n  <!--"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControls : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "-->\n</div>\n\n";
},"usePartial":true,"useData":true});

this["JST"]["templates/editor/edenableall.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"all"
    + alias4(((helper = (helper = helpers.type1 || (depth0 != null ? depth0.type1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type1","hash":{},"data":data}) : helper)))
    + "Container\" class=\"editorController\">\n  <a id=\"all"
    + alias4(((helper = (helper = helpers.type1 || (depth0 != null ? depth0.type1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type1","hash":{},"data":data}) : helper)))
    + "ContainerAnch\" href=\"#\" data-action=\"enable\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"EnAll",{"name":"getString","hash":{},"data":data}))
    + "</a>\n</div>";
},"useData":true});

this["JST"]["templates/editor/editorrich.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"virtualclass"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" class=\"vmApp virtualclass "
    + alias4(((helper = (helper = helpers["class"] || (depth0 != null ? depth0["class"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"class","hash":{},"data":data}) : helper)))
    + "\">\n  <div id=\"virtualclass"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Body\"></div>\n</div>";
},"useData":true});

this["JST"]["templates/editor/messagebox.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"synchMessageBox\" width=\"340px\" height=\"15px\">\n  <p id=\"readOnlyMsg\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"pleasewaitWhSynNewCont",{"name":"getString","hash":{},"data":data}))
    + "</p>\n</div>";
},"useData":true});

this["JST"]["templates/leftBar.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.recordingControl,depth0,{"name":"recordingControl","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.meetingMode : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.appToolsMeeting,depth0,{"name":"appToolsMeeting","data":data,"indent":"      ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.appTools,depth0,{"name":"appTools","data":data,"indent":"      ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    return "    <span class=\"nvgt prev\"></span>\n    <span class=\"nvgt next\"></span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "\n<div id=\"virtualclassAppLeftPanel\" class=\"leftbar\" data-surname=\""
    + container.escapeExpression(((helper = (helper = helpers.meetingMode || (depth0 != null ? depth0.meetingMode : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"meetingMode","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isPlay : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControls : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  <div id=\"virtualclassWhiteboard\" class=\"virtualclass whiteboard\">\n    <div class=\"whiteboardContainer\"> </div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControls : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    \n  </div>\n</div>\n";
},"usePartial":true,"useData":true});

this["JST"]["templates/main.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.precheck,depth0,{"name":"precheck","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "<div id=\"virtualclassApp\" style=\"display: block;\">\n\n"
    + ((stack1 = container.invokePartial(partials.rightBar,depth0,{"name":"rightBar","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.leftBar,depth0,{"name":"leftBar","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.popupCont,depth0,{"name":"popupCont","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial(partials.dashboardCont,depth0,{"name":"dashboardCont","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</div>";
},"usePartial":true,"useData":true});

this["JST"]["templates/multiVideo.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"videoConfrence\">\n  <div id=\"videosWrapper\">\n    <div class=\"videoCont selfVideo\"><video class=\"videoBox multilocalVideo\"  muted=\"muted\" autoplay></video></div>\n\n  </div>\n</div>\n\n";
},"useData":true});

this["JST"]["templates/multiVideoMain.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"virtualclassMultiVideo\" class=\"virtualclass container\" data-screen=\"1\" style=\"display:none\">\n  <div id=\"videoMainPreview\">\n    <!-- <canvas id=\"multiVidSelected\" width=\"900\" height=\"700\"></canvas> -->\n    <video id=\"multiVidSelected\" muted=\"muted\" > </video>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["templates/network.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"videoPacketInfo\">\n      <ul class=\"nav navbar-nav\" id=\"videoSpeed\">\n      <li id=\"videLatency\" class=\"latency  congtooltip btn btn-default\" data-latency=\""
    + alias4(((helper = (helper = helpers.latency || (depth0 != null ? depth0.latency : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"latency","hash":{},"data":data}) : helper)))
    + "\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"audiolatency",{"name":"getString","hash":{},"data":data}))
    + "\">  </li>\n      <li id=\"videoFrameRate\" class=\"quality  congtooltip btn btn-default\" data-quality=\""
    + alias4(((helper = (helper = helpers.quality || (depth0 != null ? depth0.quality : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quality","hash":{},"data":data}) : helper)))
    + "\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"videoquality",{"name":"getString","hash":{},"data":data}))
    + "\"> </li>\n      </ul>\n</div>";
},"useData":true});

this["JST"]["templates/poll/edit-modal.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "            <div class=\"inputWrapper clearfix\">\n              <textarea rows=\"1\" id=\"option"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"key","hash":{},"data":data}) : helper)))
    + "\" class=\"opt form-control\" value=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"\n                        style=\"width: 100%; float: left;\"></textarea>\n            </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block; padding-right: 0px;\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\" id=\"pollModalBody\">\n      <div id=\"contHead\" class=\"modal-header\">\n        <button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button>\n        <div id=\"editTx\" class=\"row modalHeaderTx panel-body\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"PEdit",{"name":"getString","hash":{},"data":data}))
    + "</div>\n      </div>\n      <div id=\"contBody\" class=\"modal-body\">\n        <div id=\"qnTxCont\" class=\"row previewTxCont\" style=\"display: block;\"><label class=\"pollLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + "</label>\n          <div class=\"inputWrapper clearfix\">\n            <textarea id=\"q\" class=\"qn form-control\" value=\""
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "\" rows=\"1\"></textarea>\n          </div>\n        </div>\n        <div id=\"optsTxCont\" class=\"row previewTxCont\" style=\"display: block;\">\n          <label id=\"pollOptLabel\" class=\"pollLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"option",{"name":"getString","hash":{},"data":data}))
    + "</label>\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "          <div id=\"addMoreCont\" class=\"addMoreCont\">\n            <span class=\"icon-plus\"></span>\n            <a href=\"#\" id=\"addMoreOption\" class=\"addMoreOption controls btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Addoption",{"name":"getString","hash":{},"data":data}))
    + "</a>\n          </div>\n        </div>\n      </div>\n      <div id=\"contFooter\" class=\"modal-footer\">\n        <div id=\"footerCtrCont\">\n          <button id=\"reset\" class=\"btn btn-default pull-left controls\" type=\"button\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Reset",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-reset\"></i>\n          </button>\n          <button id=\"etSave\" class=\"btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Save",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-save\"></i></button>\n          <button id=\"saveNdPublish\" class=\"btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Publish",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-publish\"></i>\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/modal.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block;\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\" id=\"pollModalBody\">\n      <div id=\"contHead\" class=\"modal-header\">\n        <button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button>\n        <div id=\"editTx\" class=\"row modalHeaderTx panel-body\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"createnewpoll",{"name":"getString","hash":{},"data":data}))
    + "</div>\n      </div>\n      <div id=\"contBody\" class=\"modal-body\">\n        <div id=\"qnTxCont\" class=\"row pollTxCont\">\n          <label class=\"pollLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + " :</label>\n          <div class=\"inputWrapper clearfix clearfix\">\n            <textarea id=\"q\" class=\"qn form-control\" rows=\"1\" placeholder=\"Type question\"></textarea>\n          </div>\n        </div>\n        <div id=\"optsTxCont\" class=\"row pollTxCont\">\n          <label class=\"optionLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"option",{"name":"getString","hash":{},"data":data}))
    + "</label>\n          <div class=\"inputWrapper clearfix\">\n            <textarea id=\"1\" class=\"opt form-control\" placeholder=\"Type option\" rows=\"1\"></textarea>\n          </div>\n          <div class=\"inputWrapper clearfix\">\n            <textarea id=\"2\" class=\"opt form-control\" rows=\"1\" placeholder=\"Type option\"></textarea>\n          </div>\n          <div id=\"addMoreCont\" class=\"addMoreCont\">\n            <span class=\"icon-plus-circle\"></span>\n            <a href=\"#\" id=\"addMoreOption\" class=\"addMoreOption btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Addoption",{"name":"getString","hash":{},"data":data}))
    + "</a>\n          </div>\n        </div>\n      </div>\n      <div id=\"contFooter\" class=\"modal-footer\">\n        <div id=\"footerCtrCont\">\n          <button id=\"reset\" class=\"btn btn-default pull-left controls\" type=\"button\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Reset",{"name":"getString","hash":{},"data":data}))
    + "</button>\n          <button id=\"etSave\" class=\"btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Save",{"name":"getString","hash":{},"data":data}))
    + "</button>\n          <button id=\"saveNdPublish\" class=\"btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Publish",{"name":"getString","hash":{},"data":data}))
    + "</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/optioninput.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  <a id=\"remove"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.close : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"close child\">×</a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"inputWrapper clearfix\">\n  <textarea rows=\"1\" id=\"option"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.close : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"opt form-control parent\" placeholder=\"Type option\"\n  ></textarea>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.close : depth0)) != null ? stack1.closeBtn : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

this["JST"]["templates/poll/pollStd.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <div>\n          <input class=\"opt\" name=\"option\" value=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\"radio\" id=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\">\n          <span>"
    + alias4(container.lambda(depth0, depth0))
    + "</span>\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"stdPollContainer\" class=\"container\">\n  <div id=\"stdContHead\" class=\"panel\">\n    <div class=\"stdHeader\">\n      <label id=\"pollHead\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"pollHead",{"name":"getString","hash":{},"data":data}))
    + "</label>\n    </div>\n    <label id=\"timerLabel\"></label>\n    <div id=\"timerCont\"></div>\n  </div>\n  <div id=\"stdContBody\" class=\"panel\">\n    <label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + " :<span id=\"stdQnCont\">"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.question : stack1), depth0))
    + "</span></label>\n    <div id=\"stdOptionCont\">\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n  <div id=\"stdContFooter\">\n    <input id=\"btnVote\" type=\"button\" class=\"btn btn-primary\" value =\"vote\">\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/pollmain.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "          <li role=\"presentation\" id=\"coursePollTab\" class=\"navListTab active\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"Polls you will create are course specific\" >\n            <a href=\"#\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Cpoll",{"name":"getString","hash":{},"data":data}))
    + "</a>\n          </li>\n          <li role=\"presentation\" id=\"sitePollTab\" class=\"navListTab\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"Polls created here are of site level\" >\n            <a href=\"# \">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Spoll",{"name":"getString","hash":{},"data":data}))
    + "</a>\n          </li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "          <li role=\"presentation\" id=\"pollResult\" class=\"navListTab\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"show result\">\n            <a href=\"# \">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Presult",{"name":"getString","hash":{},"data":data}))
    + "</a>\n          </li>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "        <div id=\"mszBoxPoll\" class=\"row\" style=\"display:none\">\n        </div>\n        <div id=\"createPollCont\" class=\"createBtnCont\">\n          <button id=\"newPollBtnsite\" class=\"btn btn-default site\" data-toogle=\"modal\" data-target=\"#editPollModal\" style=\"display: none;\"><i class=\"icon-create-new\"></i>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"addnew",{"name":"getString","hash":{},"data":data}))
    + "</button>\n          <button id=\"newPollBtncourse\" class=\"btn btn-default course\" data-toogle=\"modal\" data-target=\"#editPollModal\" style=\"display: block;\"><i class=\"icon-create-new\"></i>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"addnew",{"name":"getString","hash":{},"data":data}))
    + "</button>\n        </div>\n\n        <div id=\"bootstrapCont\" class=\"modalCont\">\n\n        </div>\n        <div class=\"table-responsive\" id=\"listQnContcourse\">\n        <table  class=\"pollList table table-bordered table-striped\" >\n          <thead>\n          <tr class=\" headerContainer\" id=\"headerContainercourse\">\n            <th class=\"controlsHeader\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Controls",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-setting\"></i></th>\n            <th class=\"qnTextHeader\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"PQuestions",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-help\"></i></th>\n            <th class=\"creatorHeader\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Creator",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-creator\"></i></th>\n          </tr>\n          </thead>\n        </table>\n        </div>\n      <div class=\"table-responsive\"  id=\"listQnContsite\" style=\"display: none;\">\n        <table class=\"pollList table table-bordered table-striped\" >\n          <thead>\n          <tr class=\" headerContainer\" id=\"headerContainersite\">\n            <th class=\"controlsHeader\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Controls",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-setting\"></i></th>\n            <th class=\"qnTextHeader\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"PQuestions",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-help\"></i></th>\n            <th class=\"creatorHeader\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Creator",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-creator\"></i></th>\n          </tr>\n          </thead>\n        </table>\n      </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "        <div id=\"mszBoxPoll\" class=\"row\">\n          <div id=\"stdPollMszLayout\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"pollmybpublish",{"name":"getString","hash":{},"data":data}))
    + "</div>\n        </div>\n        <div id=\"bootstrapCont\" class=\"modalCont\">\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"virtualclassPoll\" class=\"virtualclass\">\n  <div id=\"layoutPoll\" class=\"bootstrap container-fluid pollLayout\">\n    <nav id=\"navigator\" class=\"nav navbar\">\n      <ul class=\"nav nav-tabs pollNavBar\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "      </ul>\n\n    </nav>\n    <div id=\"layoutPollBody\" class=\"pollMainCont\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/pollresultlist.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<table id=\"listViewTable\" class=\"table table-bordered\">\n  <thead>\n  <tr>\n    <th>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"NAME",{"name":"getString","hash":{},"data":data}))
    + "</th>\n    <th>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"optselectd",{"name":"getString","hash":{},"data":data}))
    + "</th>\n  </tr>\n  </thead>\n  <tbody id=\"resultList\">\n\n  </tbody>\n</table>";
},"useData":true});

this["JST"]["templates/poll/preview-modal.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "            <div >\n              <span class=\"radio\"><input class=\"opt\" name=\"option\" value=\"1\" type=\"radio\" id=\"1\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</span>\n            </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block;\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\" id=\"pollModalBody\">\n      <div id=\"contHead\" class=\"modal-header\">\n        <button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button>\n        <div id=\"publishTx\" class=\"row modalHeaderTx panel-body\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ppoll",{"name":"getString","hash":{},"data":data}))
    + "</div>\n      </div>\n      <div id=\"contBody\" class=\"panel-body\">\n        <label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + ":<span id=\"qnTxCont\" class=\"previewTxCont\">"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "</span></label>\n        <div id=\"optsTxCont\" class=\"previewTxCont\">\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n      </div>\n      <div id=\"contFooter\" class=\"modal-footer\">\n        <div id=\"footerCtrCont\">\n          <button id=\"goBack\" data-dismiss=\"modal\" class=\"btn btn-default controls\">&lt; "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Back",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-back\"></i>\n          </button>\n          <button id=\"next\" class=\"btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Publish",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-publish\"></i></button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/previewPopup.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "          <div class=\"viewOpt\">\n            <input class=\"opt\" name=\"option\" value="
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + " type=\"radio\" id="
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + ">\n            <label>"
    + alias4(container.lambda(depth0, depth0))
    + "</label>\n          </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"popover-content\">\n    <div id=\"popupCont\" class=\"pollPreview\">\n      <div><div id=\"qnTxCont\" class=\"row previewTxCont\">\n        <label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + " :</label>\n        <div class=\"viewQn\">"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "</div>\n      </div>\n        <div id=\"optsTxCont\" class=\"row previewTxCont\">\n          <label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Options",{"name":"getString","hash":{},"data":data}))
    + " :</label>\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n      </div>\n    </div>\n  </div>\n";
},"useData":true});

this["JST"]["templates/poll/qn.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing;

  return "<tr id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"vcPollCont\">\n  <td id=\"ctrQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"pollCtrCont\">\n    <table class=\"miniTB\">\n      <tr>\n        <td>\n        <div id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "E\" class=\"editCont pull-left\">\n          <a href=\"#\" data-target=\"#editPollModal\" id=\"editQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\">\n            <span class=\"icon-pencil2 controlIcon\" data-toggle=\"congtooltip\" title="
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"edit",{"name":"getString","hash":{},"data":data}))
    + "></span>\n          </a>\n        </div>\n        </td>\n        <td>\n        <div id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"deleteCont pull-left\">\n          <a href=\"#\" id=\"deleteQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\">\n            <span class=\"icon-bin22 controlIcon\" data-toggle=\"congtooltip\" title="
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"delete",{"name":"getString","hash":{},"data":data}))
    + "></span>\n          </a>\n        </div>\n        </td>\n        <td>\n        <div class=\"publishCont pull-left\" id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "P\">\n          <a href=\"#\" id=\"publishQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\">\n            <span class=\"icon-publish2 controlIcon\" data-toggle=\"congtooltip\" title="
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"Publish",{"name":"getString","hash":{},"data":data}))
    + "></span>\n          </a>\n        </div>\n        </td>\n      </tr>\n    </table>\n\n  </td>\n  <td id=\"qnText"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"qnText\" data-toggle=\"popover\" data-trigger=\"hover\"\n       >"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "</td>\n  <td class=\"creator\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.creator : stack1), depth0))
    + "</td>\n</tr>";
},"useData":true});

this["JST"]["templates/poll/qnOptions.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "  <div>\n    <input class=\"opt\" name=\"option\" value=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\"radio\" id=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\">\n        <span>"
    + alias4(container.lambda(depth0, depth0))
    + "</span>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["templates/poll/result-modal.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "              <div>\n                <input class=\"opt\" name=\"option\" value=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\"radio\" id=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\">\n                <span>"
    + alias4(container.lambda(depth0, depth0))
    + "</span>\n              </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block;\">\n  <div class=\"modal-dialog\">\n  <div class=\"modal-content\" id=\"pollModalBody\">\n    <div id=\"contHead\" class=\"modal-header\">\n      <button type=\"button\" class=\"close\" id=\"modalClose\">×</button>\n\n      <div id=\"resultTx\" class=\"row modalHeaderTx panel-body\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Presult",{"name":"getString","hash":{},"data":data}))
    + "</div>\n    </div>\n    <div id=\"resultLayout\" class=\"panel-body\">\n      <div id=\"resultLayoutHead\" class=\"row panel\">\n        <div id=\"timerWrapper\" class=\"col-md-4\">\n          <label id=\"timerLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Rtime",{"name":"getString","hash":{},"data":data}))
    + "</label>\n          <div id=\"timerCont\"></div>\n        </div>\n        <div id=\"votesWrapper\" class=\"col-md-6\">\n          <label id=\"congreaPollVoters\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"VotedSoFar",{"name":"getString","hash":{},"data":data}))
    + "</label>\n          <div id=\"receivedVotes\"></div>\n        </div>\n      </div>\n      <div id=\"resultLayoutBody\">\n        <div id=\"TqnPoll\" class=\"panel\">\n          <label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + " : <span id=\"qnLabelCont\">"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.question : stack1), depth0))
    + "</span></label>\n          <div id=\"nonVotTqn\">\n"
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "          </div>\n        </div>\n        <div id=\"chartMenuCont\" class=\"panel\">\n          <button id=\"bar\">\n            <a href=\"#\" id=\"barView\">\n              <span class=\"icon-stats-bars\"></span>\n            </a>\n          </button>\n          <button id=\"pi\">\n            <a href=\"#\" id=\"piView\">\n              <span class=\"icon-pie-chart\"></span>\n            </a>\n          </button>\n          <button id=\"rList\">\n            <a href=\"#\" id=\"listView\">\n              <span class=\"icon-list-ul\"></span>\n            </a>\n          </button>\n        </div>\n        <div id=\"chart\" class=\"row c3\" style=\"max-height: 320px; position: relative;\"></div>\n        <div class=\"table-responsive\" id=\"listCont\" style=\"display:none\"></div>\n\n      </div>\n      <div id=\"pollResultMsz\" class=\"pollResultMsz panel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"watstdrespo",{"name":"getString","hash":{},"data":data}))
    + "</div>\n      <div id=\"resultLayoutFooter\" class=\"row\"></div>\n    </div>\n  </div>\n</div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/resultlist.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});

this["JST"]["templates/poll/setting-modal.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                <option value=\""
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"modal-dialog\" id=\"yui_3_17_2_1_1496125638736_94\">\n  <div class=\"modal-content\" id=\"pollModalBody\">\n    <div id=\"contHead\" class=\"modal-header\">\n      <button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button>\n      <div id=\"settingTx\" class=\"row modalHeaderTx panel-body\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"PSetting",{"name":"getString","hash":{},"data":data}))
    + "</div>\n    </div>\n    <div id=\"contBody\" class=\"modal-body\">\n      <div id=\"settingCont\">\n        <label class=\"pollLabel panel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ModeclosingPoll",{"name":"getString","hash":{},"data":data}))
    + "\n        <span id=\"mode\" class=\"custom-controls-stacked panel\">\n          <label class=\"custom-control custom-radio radio-inline\">\n            <input type=\"radio\" name=\"option\" value=\"BY Instructor\" id=\"radioBtn1\" class=\"custom-control-input\">\n            <span class=\"custom-control-indicator\">\n\n              </span><span class=\"custom-control-description\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ByInstructor",{"name":"getString","hash":{},"data":data}))
    + "</span>\n          </label>\n          <label class=\"custom-control custom-radio radio-inline\">\n            <input type=\"radio\" name=\"option\" value=\"BY Timer\" id=\"radioBtn2\" class=\"custom-control-input\" checked=\"checked\">\n            <span class=\"custom-control-indicator\"></span>\n            <span class=\"custom-control-description\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ByTimer",{"name":"getString","hash":{},"data":data}))
    + "</span>\n          </label>\n        </span>\n        </label>\n        <div id=\"enTimer\" class=\"panel\">\n          <label id=\"timerTx\" class=\"pollLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"SetTimer",{"name":"getString","hash":{},"data":data}))
    + "\n          <span id=\"selTime\">\n            <select id=\"timer\" name=\"timer\" class=\"form-control\" style=\"width: 100px; display: inline;\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.time : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            </select>\n            <select id=\"ut\" name=\"unit\" class=\"form-control\" style=\"width: 100px; display: inline;\">\n              <option id=\"op1\" value=\"minut\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"minute",{"name":"getString","hash":{},"data":data}))
    + "</option>\n              <option id=\"op2\" value=\"second\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"second",{"name":"getString","hash":{},"data":data}))
    + "</option>\n            </select>\n          </span>\n          </label>\n        </div>\n        <div id=\"showRt\" class=\"form-group\">\n          <label id=\"labelCk\" class=\"custom-control custom-checkbox \">\n            <input type=\"checkbox\" id=\"pollCkbox\" class=\"custom-control-input \" checked=\"checked\">\n            <span id=\"labelCk\" class=\"custom-control-description pollLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Showresulttostudents",{"name":"getString","hash":{},"data":data}))
    + "</span>\n          </label>\n        </div>\n      </div>\n    </div>\n    <div id=\"contFooter\" class=\"modal-footer\">\n      <div id=\"settingBtn\">\n        <button id=\"cacelSetting\" class=\"btn btn-default\" data-dismiss=\"modal\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"cancel",{"name":"getString","hash":{},"data":data}))
    + "</button>\n        <button id=\"publish\" class=\"btn btn-default\" disable=\"true\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Publish",{"name":"getString","hash":{},"data":data}))
    + "</button>\n      </div>\n    </div>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["templates/poll/stdResult.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.escapeExpression;

  return "<div id=\"resultLayout\">\n  <div id=\"resultLayoutHead\" class=\"stdrslt container\">\n    <div id=\"timerWrapper\">\n      <label id=\"timerLabel\">"
    + alias1((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Rtime",{"name":"getString","hash":{},"data":data}))
    + "</label>\n      <div id=\"timerCont\"></div>\n    </div>\n    <div id=\"votesWrapper\" class=\"modal-header\">\n    </div>\n  </div>\n  <div id=\"resultLayoutBody\" class=\"container stdlayout\">\n    <label>Question :<span id=\"qnLabelCont\">"
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.question : stack1), depth0))
    + "</span></label>\n\n    <div  class=\"panel\">\n      <div id=\"optnNonVotd\">\n\n      </div>\n    </div>\n\n    <div id=\"chartMenuCont\" class=\"panel\">\n      <button id=\"bar\">\n        <a href=\"#\" id=\"barView\">\n          <span class=\"icon-stats-bars\"></span>\n        </a>\n      </button>\n      <button id=\"pi\">\n        <a href=\"#\" id=\"piView\">\n          <span class=\"icon-pie-chart\"></span>\n        </a>\n      </button>\n    </div>\n    <div id=\"chart\" class=\"row c3\" style=\"display: none; max-height: 320px; position: relative;\"></div>\n  </div>\n  <div id=\"pollResultMsz\" class=\"pollResultMsz\"></div>\n  <div id=\"resultLayoutFooter\" class=\"row\">\n  </div>\n</div>";
},"useData":true});

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
    + " </span>\n    </div>\n\n    <div id=\"uploadvideourl\" class=\"popupWindow\">\n      <span id=\"endSessionclose\" class=\"icon-close\"></span>\n      <span id=\"endSessionMsg\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"validateurlmsg",{"name":"getString","hash":{},"data":data}))
    + " </span>\n    </div>\n    <div id=\"waitMsgCont\" class=\"popupWindow\">\n      <span id=\"waitMsg\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"waitmsgconnect",{"name":"getString","hash":{},"data":data}))
    + " </span>\n    </div>\n\n    <div id=\"chromeExtMiss\" class=\"popupWindow\">\n      <span id=\"chromeExtClose\" class=\"icon-close\"></span>\n      <span id=\"chromeExtMissMsg\"> Congrea needs 'Desktop Selector' pugins to share the Screen.<br />You can download the plugin\n        <a href='https://chrome.google.com/webstore/detail/desktop-selector/ijhofagnokdeoghaohcekchijfeffbjl' target='_blank'>HERE.</a>\n        After installing the plugin, please <a onclick=\"location.reload()\">Reload </a> the page.\n\n      </span>\n      </span>\n    </div>\n\n    <div id=\"generalMessage\" class=\"popupWindow\">\n      <span id=\"generalMessageMsg\"> </span>\n      <span id=\"generalMessageClose\"></span>\n\n    </div>\n\n\n\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/ppt/dashboard.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "\n<div class='dbContainer' data-app=\""
    + alias3(((helper = (helper = helpers.app || (depth0 != null ? depth0.app : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"app","hash":{},"data":data}) : helper)))
    + "\" id=\"pptDbCont\">\n  <div id=\"pptListContainer\">\n    <div id=\"listppt\" class=\"listPages pages list-group\"></div>\n    <!--<div id=\"newpptBtnCont\">-->\n      <!--<button id=\"newpptBtn\">Upload ppt url </button>-->\n    <!--</div>-->\n  </div>\n\n  <div class=\"dashboardview\" >\n    <div id=\"pptuploadContainer\">\n      <div id=\"urlcontainer\" style=\"display: block;\" class=\"form-group\">\n        <input id=\"presentationurl\" placeholder=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"EHTMLPresentUrl",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"form-control\">\n        <input type=\"submit\" id=\"submitpurl\" class =\"btn-default\"value=\"Save\">\n      </div>\n    </div>\n  </div>\n</div>\n\n\n";
},"useData":true});

this["JST"]["templates/ppt/linkPpt.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<div class=\""
    + alias4(((helper = (helper = helpers.className || (depth0 != null ? depth0.className : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"className","hash":{},"data":data}) : helper)))
    + "\" id=\"link"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\"\n     data-screen="
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + " data-rid=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-selected=\"0\" data-status=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\" draggable=\"true\">\n  <div id=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Title"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" class=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Title tooltip2\"></div>\n  <div id=\"controlCont"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" class=\"controlCont\">\n    <div class=\"controls mainpreview\" id=\"mainp"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\"\n         data-rid=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\"></div>\n    <div class=\"controls status\" data-status=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\"><a class=\"statusanch\"></a></div>\n    <div class=\"controls delete\">\n      <a class=\"deleteanch\"></a>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/ppt/mszdisplay.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<p id=\"pptMessageLayout\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"preWllBshortly",{"name":"getString","hash":{},"data":data}))
    + "</p>";
},"useData":true});

this["JST"]["templates/ppt/ppt.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    <!--<div id=\"urlcontainer\" style=\"display: block;\">-->\n      <!--<input id=\"presentationurl\" placeholder=\"Enter HTML5 Presentation Url.\">-->\n      <!--<input type=\"submit\" id=\"submitpurl\" value=\"submit\">-->\n    <!--</div>-->\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"virtualclassSharePresentation\" class=\"virtualclass\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["templates/ppt/pptiframe.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"iframecontainer\">\n  <iframe id=\"pptiframe\">\n  </iframe>\n</div>\n";
},"useData":true});

this["JST"]["templates/precheck.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<div id=\"virtualclassPreCheck\"  class=\"bootstrap\">\n  <div id=\"preCheckcontainer\">\n    <div class=\"container  \">\n      <!-- Modal -->\n      <div class=\"modal fade\" id=\"myModal\" role=\"dialog\">\n        <div class=\"modal-dialog modal-lg\">\n          <!-- Modal content-->\n          <div class=\"modal-content\">\n            <div class=\"modal-body\">\n              <div id=\"preCheckProgress\">\n                <ul class=\"progressbar\" id=\"congProgressbar\">\n                  <li class=\"screen1 browser active\"></li>\n                  <li class=\"screen2 bandwidth\"></li>\n                  <li class=\"screen5 speaker\"></li>\n                  <li class=\"screen4 mic\"></li>\n                  <li class=\"screen3 webcam\"></li>\n                </ul>\n              </div>\n\n              <div id=\"vcBrowserCheck\" class=\"precheck browser\">\n                <div class=\"testName\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"testingbrowser",{"name":"getString","hash":{},"data":data}))
    + "  </div>\n                <!-- <div class=\"progress\"> Progressing .... </div> -->\n                <div class=\"result\"></div>\n                <div id=\"browserButtons\" class=\"button clearfix\">\n                  <button type=\"button\" class=\"next btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Next",{"name":"getString","hash":{},"data":data}))
    + "</button>\n                </div>\n              </div>\n\n              <div id=\"vcBandWidthCheck\" class=\"precheck bandwidth\">\n                <div class=\"testName\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"testinginternetspeed",{"name":"getString","hash":{},"data":data}))
    + " </div>\n                <!-- <div class=\"progress\"> Progressing....</div> -->\n                <div class=\"result\"><img src=\""
    + alias3(((helper = (helper = helpers.whiteboardPath || (depth0 != null ? depth0.whiteboardPath : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"whiteboardPath","hash":{},"data":data}) : helper)))
    + "images/progressbar.gif\" /></div>\n                <div id=\"bandwidthButtons\" class=\"button clearfix\">\n                  <button type=\"button\" class=\"prev btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Prev",{"name":"getString","hash":{},"data":data}))
    + "</button>\n                  <button type=\"button\" class=\"next btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Next",{"name":"getString","hash":{},"data":data}))
    + "</button>\n                </div>\n              </div>\n\n              <div id=\"vcSpeakerCheck\" class=\"precheck speaker\">\n                <div class=\"testName\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"testingspeaker",{"name":"getString","hash":{},"data":data}))
    + " </div>\n                <!-- <div class=\"progress\"> Progressing....</div> -->\n                <audio id=\"vcSpeakerCheckAudio\">\n                  <source src=\""
    + alias3(((helper = (helper = helpers.whiteboardPath || (depth0 != null ? depth0.whiteboardPath : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"whiteboardPath","hash":{},"data":data}) : helper)))
    + "audio/audio_music.ogg\">\n                  <source src=\""
    + alias3(((helper = (helper = helpers.whiteboardPath || (depth0 != null ? depth0.whiteboardPath : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"whiteboardPath","hash":{},"data":data}) : helper)))
    + "audio/audio-music.mp3\">\n                </audio>\n\n                <div class=\"result\"></div>\n\n                <div id=\"speakerButtons\" class=\"button clearfix\">\n                  <button type=\"button\" class=\"prev btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Prev",{"name":"getString","hash":{},"data":data}))
    + "</button>\n                  <button type=\"button\" class=\"next btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Next",{"name":"getString","hash":{},"data":data}))
    + "</button>\n                </div>\n              </div>\n\n              <div id=\"vcMicCheck\" class=\"precheck mic\">\n                <div class=\"testName\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"testingmichrophone",{"name":"getString","hash":{},"data":data}))
    + "</div>\n                <!-- <div class=\"progress\"> Progressing....</div> -->\n                <div id=\"audioVisualaizerCont\">\n                  <canvas id=\"audioVisualaizer\" class=\"visualizer\" width=\"60\"></canvas>\n                </div>\n\n                <div class=\"result\"></div>\n\n                <div id=\"micButtons\" class=\"button clearfix\">\n                  <button type=\"button\" class=\"prev btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Prev",{"name":"getString","hash":{},"data":data}))
    + "</button>\n                  <button type=\"button\" class=\"next btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Next",{"name":"getString","hash":{},"data":data}))
    + "</button>\n                </div>\n              </div>\n\n              <div id=\"vcWebCamCheck\" class=\"precheck webcam\">\n                <div class=\"testName\">  "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"testingwebcam",{"name":"getString","hash":{},"data":data}))
    + " </div>\n                <!-- <div class=\"progress\"> Progressing....</div> -->\n                <div id=\"webcamTempVideoCon\">\n                  <video id=\"webcamTempVideo\"></video>\n                </div>\n\n                <div class=\"result\"></div>\n\n                <div id=\"joinSession\" class=\"button clearfix\">\n                  <button type=\"button\" class=\"prev btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Prev",{"name":"getString","hash":{},"data":data}))
    + "</button>\n                  <button type=\"button\" class=\"next btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"JoinSession",{"name":"getString","hash":{},"data":data}))
    + "</button>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/recordingControl.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"playControllerCont\">\n  <div id=\"playController\">\n    <div id=\"recPlayCont\" class=\"recButton\"> <button id=\"recPlay\" class=\"icon-play congtooltip\" data-title=\"Play\"></button></div>\n    <div id=\"recPauseCont\" class=\"recButton \"> <button id=\"recPause\" class=\"icon-pause congtooltip\" data-title=\"Pause\"></button></div>\n    <div id=\"ff2Cont\" class=\"recButton\"> <button id=\"ff2\" class=\"ff icon-forward congtooltip\" data-title=\"Fast Forward 2\"></button></div>\n    <div id=\"ff8Cont\" class=\"recButton\"> <button id=\"ff8\" class=\"ff icon-fast-forward congtooltip\" data-title=\"Fast Forward 8\"></button></div>\n    <div id=\"playProgress\"> <div id=\"playProgressBar\" class=\"progressBar\" style=\"width: 0%;\"></div> </div>\n    <div id=\"repTimeCont\"> <span id=\"tillRepTime\">00:00</span> / <span id=\"totalRepTime\">00:00</span> </div>\n  </div>\n  <div id=\"replayFromStart\"> <button  class=\"ff icon-Replayfromstart congtooltip\" data-title=\"Replay from Start.\"></button> </div>\n</div>";
},"useData":true});

this["JST"]["templates/rightBar.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"virtualclassAppRightPanel\" class=\"rightbar bootstrap\">\n"
    + ((stack1 = container.invokePartial(partials.audioWidget,depth0,{"name":"audioWidget","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + ((stack1 = container.invokePartial((helpers.getVideoType || (depth0 && depth0.getVideoType) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"getVideoType","hash":{},"data":data}),depth0,{"data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  <div id=\"chatWidget\">\n    <div id=\"stickycontainer\"></div>\n    <div id=\"congreaChatCont\"></div>\n  </div>\n</div>";
},"usePartial":true,"useData":true});

this["JST"]["templates/ssmainDiv.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.recImg : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    return "      <div id=\"virtualclassScreenShareLocalTemp\">\n        <canvas id=\"virtualclassScreenShareLocalTempVideo\" width=\"1440\" height=\"738\"></canvas>\n      </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "      <div id=\"virtualclassScreenShareLocal\" class=\"Local \" style=\"position: relative; width: 1536px; height: 677px;\">\n        <video id=\"virtualclassScreenShareLocalVideo\" autoplay=\"true\" src=\" \"></video>\n      </div>\n\n    <div id=\"virtualclassScreenShareLocalSmall\" class=\"Local \">\n      <video id=\"virtualclassScreenShareLocalVideosmall\" autoplay=\"true\" src=\" \"></video>\n\n      <h3 id=\"screenShrMsg\" class=\"alert alert-info\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"screensharemsg",{"name":"getString","hash":{},"data":data}))
    + "</h3>\n    </div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "    <div id=\"virtualclassScreenShareLocal\" class=\"Local\">\n      <canvas id=\"virtualclassScreenShareLocalVideo\" width=\"886\" height=\"724\"></canvas>\n    </div>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.recImg : depth0),{"name":"unless","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    return "      <div id=\"virtualclassScreenShareLocalTemp\">\n        <canvas id=\"virtualclassScreenShareLocalTempVideo\" width=\"900\" height=\"740\"></canvas>\n      </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"virtualclassScreenShare\" class=\"virtualclass \">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["templates/teacherVideo.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    <video id=\"videoHostSource\" autoplay=\"\" muted=\"muted\"></video>\n    <canvas id=\"videoHost\"></canvas>\n    <canvas id=\"videoHostSlice\"></canvas>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <div id=\"fromServer\">\n      <canvas id=\"videoParticipate\" > </canvas>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"videoHostContainer\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.hasControl : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\n\n";
},"useData":true});

this["JST"]["templates/videoupload/linkvideo.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "    <div class=\"controls status\" data-status=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\"  data-toggle=\"congtooltip\" title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"disable",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"statusanch\">status\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\"</a></div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "      <div class=\"controls status\" data-status=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\"  data-toggle=\"congtooltip\" title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"enable",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"statusanch\">status\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\"</a></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<div class=\""
    + alias4(((helper = (helper = helpers.className || (depth0 != null ? depth0.className : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"className","hash":{},"data":data}) : helper)))
    + "\" id=\"link"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\"\n     data-screen="
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + " data-rid=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-selected=\"0\" data-status=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\" draggable=\"true\">\n  <div class=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "TitleCont col-md-10\" id =\"videoTitleCont"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\">\n    <div id=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Title"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" class=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Title tooltip2\"></div>\n    <div class=\"controls edit\"   data-toggle=\"congtooltip\" title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"edittitle",{"name":"getString","hash":{},"data":data}))
    + "\">\n      <a class=\"editanch\" id =\"editVideoTitle"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\"></a>\n    </div>\n  </div>\n\n  <div id=\"controlCont"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" class=\"controlCont col-md-2\">\n    <div class=\"controls mainpreview \" id=\"mainp"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\"\n         data-toggle=\"congtooltip\" title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"clicktoplay",{"name":"getString","hash":{},"data":data}))
    + "\" data-rid=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\"   style=\"opacity: 1; pointer-events: auto;\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"clicktoplay",{"name":"getString","hash":{},"data":data}))
    + "</div>\n\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "    <div class=\"controls delete\"  data-toggle=\"congtooltip\" title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"delete",{"name":"getString","hash":{},"data":data}))
    + "\">\n      <a class=\"deleteanch\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"delete",{"name":"getString","hash":{},"data":data}))
    + "</a>\n    </div>\n  </div>\n</div>\n\n";
},"useData":true});

this["JST"]["templates/videoupload/popup.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "\n<div id =\"videoPopup\" data-app=\"Video\" class=\"dbContainer\">\n\n<div id =\"uploadMsz\" class=\"qq-gallery\" style=\"display:none\">\n\n</div>\n\n<div id =\"congreavideoContBody\">\n\n</div>\n  <div id =\"listvideo\">\n\n  </div>\n<div id = \"congreaShareVideoUrlCont\">\n  <div id =\"uploadBtnCont\">\n    <button  type=\"button\" id=\"uploadVideo\"class=\"btn btn-default\" >"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"uploadvideo",{"name":"getString","hash":{},"data":data}))
    + "</button>\n  </div>\n  <div id=\"videoUrlContainer\">\n    <input id=\"videourl\" placeholder=\"Share video with Online Video Url\">\n    <button  type=\"button\" id=\"submitURL\"class=\"btn btn-default\" ><i class=\"icon-savevideo cgIcon\"></i></button>\n  </div>\n\n</div>\n</div>";
},"useData":true});

this["JST"]["templates/videoupload/videoupload.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    <div id=\"videoPopupCont\">\n    </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <p id=\"messageLayoutVideo\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Vwllbshrshortly",{"name":"getString","hash":{},"data":data}))
    + "</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"virtualclassVideo\" class=\"bootstrap virtualclass\" style=\"display: block;\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "  <div id =\"player\"></div>\n  <div id=\"videoPlayerCont\">\n  </div>\n</div>";
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
    + "\">\n  <div id=\"containerWb"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"containerWb\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControl : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      <div id=\"canvasWrapper"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"canvasWrapper\">\n      <canvas id=\"canvas"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\" width=\"730\" height=\"750\">\n        "
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"canvasmissing",{"name":"getString","hash":{},"data":data}))
    + "\n      </canvas>\n    </div>\n  </div>\n</div>";
},"usePartial":true,"useData":true});

this["JST"]["templates/whiteboard/toolbar.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"commandToolsWrapper"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"commandToolsWrapper\">\n  <div id=\"t_rectangle"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"rectangle\">\n    <a href=\"#\" data-title=\"Rectangle\" class=\"congtooltip\"><span class=\"icon-rectangle cgIcon\"></span></a>\n  </div>\n\n  <div id=\"t_line"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"line\">\n    <a href=\"#\" data-title=\"Line\" class=\"congtooltip\"> <span class=\"icon-line cgIcon\"></span></a>\n  </div>\n\n  <div id=\"t_freeDrawing"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"freeDrawing\">\n    <a href=\"#\" data-title=\"Free hand\" class=\"congtooltip\"> <span class=\"icon-freeDrawing cgIcon\"></span></a>\n  </div>\n\n  <div id=\"t_oval"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"oval\">\n    <a href=\"#\" data-title=\"Oval\" class=\"congtooltip\"> <span class=\"icon-oval cgIcon\"></span></a>\n  </div>\n\n  <div id=\"t_triangle"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"triangle\">\n    <a href=\"#\" data-title=\"Triangle\" class=\"congtooltip\"> <span class=\"icon-triangle cgIcon\"></span></a>\n  </div>\n\n  <div id=\"t_text"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"text\">\n    <a href=\"#\" data-title=\"Text\" class=\"congtooltip\"> <span class=\"icon-text cgIcon\"></span></a>\n  </div>\n\n  <div id=\"t_activeall"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"activeAll\">\n    <a href=\"#\" data-title=\"Active All\" class=\"congtooltip\"> <span class=\"icon-activeAll cgIcon\"></span></a>\n  </div>\n\n  <div id=\"t_clearall"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"clearAll\">\n    <a href=\"#\" data-title=\"Clear All\" class=\"congtooltip\"> <span class=\"icon-clearAll cgIcon\"></span></a>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/youtube/yts.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.ytscontrol,depth0,{"name":"ytscontrol","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    return "    <p id=\"messageLayout\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"youtubewllbshrshortly",{"name":"getString","hash":{},"data":data}))
    + "</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"virtualclassYts\" class=\"virtualclass\">\n  <div id=\"player\"></div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hascontrol : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.createMsg : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"usePartial":true,"useData":true});

this["JST"]["templates/youtube/ytscontrol.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"youtubeUrlContainer\">\n  <input id=\"youtubeurl\" placeholder=\"Enter YouTube Video URL.\">\n  <button id=\"submitURL\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"ShareYouTubeVideo",{"name":"getString","hash":{},"data":data}))
    + "</button>\n</div>";
},"useData":true});

this["JST"]["templates/zoomControl.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"zoomControler\">\n  <button class=\"zoomIn\"> ZOOM in </button>\n  <button class=\"zoomOut\">ZOOM out</button>\n  <button class=\"fitScreen\">Fit to Screen</button>\n</div>";
},"useData":true});