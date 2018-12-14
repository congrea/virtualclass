this["JST"] = this["JST"] || {};

this["JST"]["dest_temp/templates/appSettingDetail.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return " <div class=\"bulkUserActions app-setting-rbs\"><div class=\"setting-heading\"><label class=\"bulk\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"bulkUserActions",{"name":"getString","hash":{},"data":data}))
    + "</label></div><ul class=\"list-group\"><li class=\"lists-cont d-flex justify-content-between align-items-center\" id=\"contrAudioAll\"><div class=\"appSettingIcons\" id=\"usersMuteSwitch\"></div> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"muteAllAudio",{"name":"getString","hash":{},"data":data}))
    + " <label class=\"switch\"><input type=\"checkbox\"><span class=\"slider round icon-all-audio-enable congtooltip\" id=\"contrAudioAllImg\"></span></label></li><li class=\"lists-cont d-flex justify-content-between align-items-center\" id=\"contrVideoAll\"><div class=\"appSettingIcons\" id=\"usersVideoSwitch\"></div> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"disableAllVideo",{"name":"getString","hash":{},"data":data}))
    + " <label class=\"switch video_toggle\"><input type=\"checkbox\"><span class=\"slider round icon-all-video-enable congtooltip\" id=\"contrVideoAllImg\"></span></label></li></ul></div> ";
},"3":function(container,depth0,helpers,partials,data) {
    return " <div class=\"uiMuteAll\"><a id=\"contrAudioAll\"><span class=\"cgIcon\"id=\"contrAudioAllImg\" data-action=\"disable\" class=\"icon-all-audio-disable cgIcon\" data-title=\""
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"muteAll",{"name":"getString","hash":{},"data":data}))
    + "\"></span></a></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"appSettingDetail\"> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControl : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <div id=\"settingGeneral\" class=\"app-settings-rbs\"><div class=\"setting-heading\"><label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"general",{"name":"getString","hash":{},"data":data}))
    + "</label></div><ul class=\"list-group\"><li class=\"lists-cont d-flex justify-content-between align-items-center\"><div class=\"appSettingIcons\" id=\"validate-precheck\"></div> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"appPrerequites",{"name":"getString","hash":{},"data":data}))
    + " <span class=\"pre-check-btn\"><div id=\"settingPrecheck\"><div class=\"prechk\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"precheck",{"name":"getString","hash":{},"data":data}))
    + "\" id=\"precheckTest\"><span class=\"precheck cgIcon\" id=\"precheckSetting\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"precheckStart",{"name":"getString","hash":{},"data":data}))
    + "</span></div></div></span></li></ul></div><div id=\"settingAudioVideo\" style=\"display:none;\"> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControl : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div><div id=\"settingMedia\" class=\"app-settings-rbs\"><div id=\"webRtcIo\" class=\"io\" data-suggestion=\"\"></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/appSettingMedia.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"webRtcIoContainer\" class=\"rtcIo\"><div class=\"setting-heading\"><label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"media",{"name":"getString","hash":{},"data":data}))
    + "</label></div><ul class=\"list-group\"><li class=\"lists-cont d-flex justify-content-between align-items-center ainput\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"audioInput",{"name":"getString","hash":{},"data":data}))
    + " <div class=\"audio-options\"><select id=\"audioSource\"></select><span class=\"hide\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"noain",{"name":"getString","hash":{},"data":data}))
    + "</span></div></li><li class=\"lists-cont d-flex justify-content-between align-items-center aoutput\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"audioOutput",{"name":"getString","hash":{},"data":data}))
    + " <div class=\"audio-options\"><select id=\"audioOutput\"></select><span class=\"hide\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"noaout",{"name":"getString","hash":{},"data":data}))
    + "</span></div></li><li class=\"lists-cont clearfix justify-content-between align-items-center vinput\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"videoInput",{"name":"getString","hash":{},"data":data}))
    + " <div class=\"audio-options\"><select id=\"videoSource\"></select><span class=\"hide\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"novideo",{"name":"getString","hash":{},"data":data}))
    + "</span></div><div id=\"congreaVideoSettingCont\" data-setting-type=\"audio\"><video id=\"congreaVideoSetting\" playsinline autoplay muted></video></div></li></ul></div>";
},"useData":true});

this["JST"]["dest_temp/templates/appTools.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"virtualclassAppOptionsCont\" style=\"z-index: 100;\"><div id=\"virtualclassOptionsCont\" style=\"z-index: 100;\"><div class=\"appOptions\" id=\"virtualclassWhiteboardTool\"><a class=\"congtooltip\" data-doc=\"_doc0_0\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Whiteboard",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-whiteboard cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassDocumentShareTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"DocumentSharing",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-documentShare cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassScreenShareTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ScreenShare",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-screenshare cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassVideoTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ShareVideo",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-videoUpload cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassPollTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"poll",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-poll cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassQuizTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Quiz",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-quiz cgIcon\"></span></a></div><div class=\"appOptions active\" id=\"virtualclassEditorRichTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"TextEditor",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-editorRich cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassEditorCodeTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"CodeEditor",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-editorCode cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassSharePresentationTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"SharePresentation",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-sharePresentation cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassSessionEndTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"SessionEnd",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-sessionend cgIcon\"></span></a></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/appToolsMeeting.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"virtualclassAppOptionsCont\" style=\"z-index: 100;\"><div id=\"virtualclassOptionsCont\" style=\"z-index: 100;\"><div class=\"appOptions\" id=\"virtualclassWhiteboardTool\"><a class=\"congtooltip\" data-doc=\"_doc0_0\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Whiteboard",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-whiteboard cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassDocumentShareTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"DocumentSharing",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-documentShare cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassScreenShareTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ScreenShare",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-screenshare cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassVideoTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ShareVideo",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-videoUpload cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassPollTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"poll",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-poll cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassQuizTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Quiz",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-quiz cgIcon\"></span></a></div><div class=\"appOptions active\" id=\"virtualclassEditorRichTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"TextEditor",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-editorRich cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassEditorCodeTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"CodeEditor",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-editorCode cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassSharePresentationTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"SharePresentation",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-sharePresentation cgIcon\"></span></a></div><div class=\"appOptions\" id=\"virtualclassMultiVideoTool\"><a class=\"congtooltip\" data-title=\"Video Confrence\" href=\"#\"><span class=\"icon-videoConfrence\"></span></a></div><div class=\"appOptions\" id=\"virtualclassSessionEndTool\"><a class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"SessionEnd",{"name":"getString","hash":{},"data":data}))
    + "\" href=\"#\"><span class=\"icon-sessionend cgIcon\"></span></a></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/audioWidget.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"audioWidget\"><ul class=\"nav navbar-nav\" id=\"mainAudioPanel\"><li id=\"speakerPressOnce\" class=\""
    + alias4(((helper = (helper = helpers.classes || (depth0 != null ? depth0.classes : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"classes","hash":{},"data":data}) : helper)))
    + "\" data-audio-playing="
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"dap",{"name":"getString","hash":{},"data":data}))
    + "><a id=\"speakerPressonce\" class=\"congtooltip\" data-title=\""
    + alias4(((helper = (helper = helpers.audio_tooltip || (depth0 != null ? depth0.audio_tooltip : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"audio_tooltip","hash":{},"data":data}) : helper)))
    + "\" data-meeting=\""
    + alias4(((helper = (helper = helpers.meetingMode || (depth0 != null ? depth0.meetingMode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"meetingMode","hash":{},"data":data}) : helper)))
    + "\" name=\"speakerPressonceAnch\"><span id=\"speakerPressingbtnIcon\" class=\"audioIcon silenceDetect cgIcon\" data-silence-detect=\"stop\"></span></a></li><li class=\"videoSwitchCont congtooltip\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"videooff",{"name":"getString","hash":{},"data":data}))
    + "\" id=\"congCtrBar\"><a id=\"rightCtlr\"><span id=\"videoSwitch\" data-action=\"disable\" class=\"video on\"></span></a></li><li id=\"appSettingCtrl\" class=\"congtooltip chatActive\" data-title =\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"setting",{"name":"getString","hash":{},"data":data}))
    + "\"><a id=\"appSettingCtrlAnchor\"><span class=\"setting-btn cgIcon\"></span></a></li></ul></div>";
},"useData":true});

this["JST"]["dest_temp/templates/chat/chatCont.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"ui-widget ui-corner-top ui-memblist\" id=\"memlist\" style=\"display: block; right: -1px; z-index: 0;\"><div class=\"ui-widget-content ui-memblist-content\" id=\"yui_3_17_2_1_1496901386584_68\"><div id=\"chat_div\" class=\"ui-widget-content ui-memblist-log\" style=\"height: 389px; width: 320px; max-height: 429px;\"></div></div></div><div class=\"ui-widget ui-corner-top ui-chatroom enable\" id=\"chatrm\" style=\"width: 304px; left: 6px; display: none; z-index: 1;\"><div class=\"ui-widget-content ui-chatbox-content\" id=\"yui_3_17_2_1_1496901386584_77\"><ul id=\"chat_room\" class=\"ui-widget-content ui-chatbox-log\"></ul></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/chat/chatMain.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"ui-widget ui-corner-top ui-memblist\" id=\"memlist\" style=\"display: block; right: -1px; z-index: 0;\"><div class=\"ui-widget-content ui-memblist-content\" id=\"yui_3_17_2_1_1496901386584_68\"></div></div><div class=\"ui-widget ui-corner-top ui-chatroom enable\" id=\"chatrm\" style=\"width: 304px; left: 6px; display: none; z-index: 1;\"><div class=\"ui-widget-content ui-chatbox-content\" id=\"yui_3_17_2_1_1496901386584_77\"><ul id=\"chat_room\" class=\"ui-widget-content ui-chatbox-log\"></ul></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/chat/chatbox.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li id=\"tabcb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"ui-state-default ui-corner-bottom ui-tabs-active ui-state-active\" aria-controls=\"tabcb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><a href=\"#tabcb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"ui-tabs-anchor\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"adminusr",{"name":"getString","hash":{},"data":data}))
    + "</a><a href=\"#\" role=\"button\" class=\"ui-corner-all ui-chatbox-icon\"><span class=\"ui-icon icon-close\"></span></a><div class=\"ui-widget ui-corner-top ui-chatbox\" id=\"cb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" style=\"width: 230px;\"><div class=\"ui-widget-header ui-corner-top ui-chatbox-titlebar ui-dialog-header\"><span class=\"cgText\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"adminusr",{"name":"getString","hash":{},"data":data}))
    + "</span><a href=\"#\" class=\"ui-chatbox-icon\" role=\"button\"><span class=\"ui-icon icon-close cgIcon\"></span></a><a href=\"#\" class=\"ui-chatbox-icon\" role=\"button\"><span class=\"ui-icon icon-minus cgIcon\"></span></a></div><div class=\"ui-widget-content ui-chatbox-content\" id=\"yui_3_17_2_1_1496992871757_60\"><div id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"ui-widget-content ui-chatbox-log\"></div><div class=\"ui-widget-content ui-chatbox-input\" id=\"yui_3_17_2_1_1496992871757_59\"><textarea class=\"ui-widget-content ui-chatbox-input-box\" id=\"ta"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" style=\"width: 219px;\"></textarea></div></div></div></li>";
},"useData":true});

this["JST"]["dest_temp/templates/chat/chatuser.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return " <a href=\"#"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "\" class=\"pull-left\"><img class=\"media-object\" src=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.chatIconColors : stack1)) != null ? stack1.savedImg : stack1), depth0))
    + "\"></a> ";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return " <a href=\"#"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "\" class=\"chat-user-icon pull-left\" data-event='ub'><span data-event='ub' class=\"chat-img media-object \" style=\"background-color:"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.chatIconColors : stack1)) != null ? stack1.bgColor : stack1), depth0))
    + ";color:"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.chatIconColors : stack1)) != null ? stack1.textColor : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.chatIconColors : stack1)) != null ? stack1.initial : stack1), depth0))
    + "</span></a> ";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing;

  return " <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "ControlContainer\" class=\"controls\"> "
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.isTeacher : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <div class=\"controleCont\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudCont\"><a class=\"congtooltip\" data-title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"audioEnable",{"name":"getString","hash":{},"data":data}))
    + "\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudAnch\" data-event=\"ac\"><span class=\"icon-audioImg enable audioImg contImg\" data-audio-disable=\"false\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudImg\" data-event=\"ac\"></span></a></div><div class=\"controleCont userChat\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatCont\"><a class=\"congtooltip\" data-title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"chatEnable",{"name":"getString","hash":{},"data":data}))
    + "\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatAnch\" data-event=\"ch\"><span class=\"icon-chatImg enable chatImg contImg\" data-chat-disable=\"false\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatImg\" data-event=\"ch\"></span></a></div> "
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.isTeacher : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div> ";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing;

  return " <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAssignCont\" class=\"controleCont roleassign\"><a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAssignAnch\" class=\"congtooltip\" data-title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"transferControls",{"name":"getString","hash":{},"data":data}))
    + "\"><span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAssignImg\" data-assign-disable=\"false\" class=\"icon-assignImg enable assignImg contImg\"></span></a></div><div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contRaiseH\" class=\"controleCont controllerRaiseH disabled\"><a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contRaiseAnch\" class=\"congtooltip\" data-title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"disabled",{"name":"getString","hash":{},"data":data}))
    + "\" data-event=\"rh\"><span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrRaiseHandImg\" data-raisehand-disable=\"true\" class=\"icon-RaiseHandImg RaiseHandImg contImg\" data-event=\"rh\"></span></a></div><div class=\"controleCont\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrstdscreenCont\"><a class=\"congtooltip\" data-title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"requestScreenShare",{"name":"getString","hash":{},"data":data}))
    + "\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrstdscreenAnch\" data-event=\"rs\"><span class=\"icon-stdscreenImg enable stdscreenImg contImg\" data-chat-disable=\"false\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrstdscreenImg\" data-event=\"rs\"></span></a></div> ";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing;

  return " <div class=\"controleCont controllereditorRich\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichCont\"><a class=\"congtooltip\" data-title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"writemode",{"name":"getString","hash":{},"data":data}))
    + "\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichAnch\" data-event=\"er\"><span class=\"icon-editorRichImg block editorRichImg contImg\" data-editorrich-disable=\"true\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichImg\" data-event=\"er\"></span></a></div><div class=\"controleCont controllereditorCode\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeCont\" style=\"display: none;\"><a class=\"congtooltip\" data-title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"writemode",{"name":"getString","hash":{},"data":data}))
    + "\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeAnch\"><span class=\"icon-editorCodeImg block editorCodeImg contImg\" data-editorcode-disable=\"true\" id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeImg\" data-event=\"er\"></span></a></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"userImg ui-memblist-usr online media "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.rl : stack1), depth0))
    + " \" id=\"ml"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "\" data-role=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.rl : stack1), depth0))
    + "\"><div class=\"user-details media-body\"> "
    + ((stack1 = helpers["if"].call(alias3,((stack1 = ((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.chatIconColors : stack1)) != null ? stack1.savedImg : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + " <div class=\"usern\"><a href=\"#"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.name : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.lname : stack1), depth0))
    + "\" data-event='ub' class=\"media-heading\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.name : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.lname : stack1), depth0))
    + "</a></div></div> "
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.notSelf : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div>";
},"useData":true});

this["JST"]["dest_temp/templates/chat/stickycont.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return " <li class=\"vmchat_bar_button active\" id=\"user_list\"><a class=\"inner_bt congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"userList",{"name":"getString","hash":{},"data":data}))
    + "\"><span id=\"usertab_text\"><span id=\"onlineusertext\" class=\"cgText\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"userList",{"name":"getString","hash":{},"data":data}))
    + "</span></span></a><a class=\"rHandNotify hand_bt\"><span id=\"rhtab_text\"><span id=\"notifyText\" class=\"cgText\"></span></span></a></li> ";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return " <li class=\"vmchat_bar_button congtooltip active\" id=\"user_list\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"userList",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"inner_bt \"><span id=\"usertab_text\"><span id=\"onlineusertext\" class=\"cgText\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"userList",{"name":"getString","hash":{},"data":data}))
    + "</span></span></a></li> ";
},"5":function(container,depth0,helpers,partials,data) {
    return " ";
},"7":function(container,depth0,helpers,partials,data) {
    return " <li class=\"handRaise enable congtooltip \" id=\"congHr\" data-title =\""
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"RaiseHandStdEnabled",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"stdRaiseHand\"><span id=\"icHr\" data-action=\"enable\" class=\"icon-hr-enable\"></span></a></li> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<ul class=\"chatBarTab nav navbar-nav\"> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + " <li class=\"vmchat_room_bt congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"commonChat",{"name":"getString","hash":{},"data":data}))
    + "\" id=\"chatroom_bt2\"><a class=\"inner_bt\"><span id=\"chatroom_icon\"><span class=\"icon-chatroom cgIcon\"></span></span><span id=\"chatroom_text\" class=\"cgText\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Chatroom",{"name":"getString","hash":{},"data":data}))
    + "</span></a></li> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + " </ul><div id=\"stickybar\" class=\"maximize something-happend\"><div id=\"tabs\" class=\"tabs-bottom ui-tabs ui-widget ui-widget-content ui-corner-all\"><ul class=\"tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all\" role=\"tablist\"></ul></div><div id=\"networkStatusContainer\" class=\"connecting-room\"><div id=\"networkLatency\"><div id=\"proposedSpeed\"><div id=\"svgContainer\"><svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 470.149 470.149\" style=\"enable-background:new 0 0 470.149 470.149;\" xml:space=\"preserve\"><path id=\"signalendpoint\" class=\"signal\" d=\"M202.775,383.825c0,17.567,14.167,31.733,31.733,31.733s31.733-14.167,31.733-31.733 c0-17.567-14.167-31.733-31.733-31.733C217.225,352.091,202.775,366.258,202.775,383.825z M236.775,383.825 c0,1.133-0.85,2.267-2.267,2.267c-1.133,0-2.267-0.85-2.267-2.267c0-1.133,0.85-2.267,2.267-2.267 C235.925,381.841,236.775,382.691,236.775,383.825z\"/><path id=\"mediumstepfst\" class=\"signalone\" d=\"M373.625,243.008c4.533,0,9.067-1.983,12.467-5.383c6.233-6.8,5.95-17.567-1.133-24.083 c-41.083-37.683-94.35-58.65-150.45-58.65c-55.25,0-108.233,20.4-149.033,57.517c-7.083,6.233-7.367,17-1.133,24.083 c6.233,7.083,17,7.367,24.083,1.133c34.567-31.45,79.617-48.733,126.367-48.733c47.317,0,92.65,17.567,127.217,49.583 C365.408,241.591,369.375,243.008,373.625,243.008z\"/><path id=\"lowstepfst\" class=\"signalfive\" d=\"M310.158,319.225c4.533,0,9.067-1.983,12.467-5.383c6.233-6.8,5.95-17.567-1.133-24.083c-23.8-21.817-54.683-34-86.7-34 s-62.617,11.9-86.133,33.15c-7.083,6.233-7.367,17-1.133,24.083c6.233,7.083,17,7.367,24.083,1.133 c17.283-15.867,39.95-24.367,63.183-24.367c23.8,0,46.467,8.783,63.75,24.933C301.941,317.808,306.191,319.225,310.158,319.225z\"/><path id=\"highstepfst\" class=\"signalthree\" d=\"M453.241,173.875c4.533,0,9.067-1.983,12.467-5.383c6.233-6.8,5.95-17.567-1.133-24.083 c-62.9-58.083-144.783-89.817-230.35-89.817c-84.717,0-166.033,31.45-228.65,88.117c-7.083,6.233-7.367,17-1.133,24.083 s17,7.367,24.083,1.133c56.383-51.283,129.483-79.333,205.7-79.333c77.067,0,150.733,28.617,207.4,80.75 C445.025,172.175,449.275,173.875,453.241,173.875z\"/></svg></div></div></div><div id=\"connectingRoomIcon\"><span class=\"icon-whiteboard \"><svg id=\"svg-spinner\" xmlns=\"http://www.w3.org/2000/svg\" width=\"30\" height=\"30\" viewBox=\"0 0 48 48\"><circle cx=\"24\" cy=\"4\" r=\"4\" fill=\"#fff\"></circle><circle cx=\"12.19\" cy=\"7.86\" r=\"3.7\" fill=\"#fffbf2\"></circle><circle cx=\"5.02\" cy=\"17.68\" r=\"3.4\" fill=\"#fef7e4\"></circle><circle cx=\"5.02\" cy=\"30.32\" r=\"3.1\" fill=\"#fef3d7\"></circle><circle cx=\"12.19\" cy=\"40.14\" r=\"2.8\" fill=\"#feefc9\"></circle><circle cx=\"24\" cy=\"44\" r=\"2.5\" fill=\"#feebbc\"></circle><circle cx=\"35.81\" cy=\"40.14\" r=\"2.2\" fill=\"#fde7af\"></circle><circle cx=\"42.98\" cy=\"30.32\" r=\"1.9\" fill=\"#fde3a1\"></circle><circle cx=\"42.98\" cy=\"17.68\" r=\"1.6\" fill=\"#fddf94\"></circle><circle cx=\"35.81\" cy=\"7.86\" r=\"1.3\" fill=\"#fcdb86\"></circle></svg></span></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/dashboard.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"congdashboard\" class=\"modal in\" role=\"dialog\"><div class=\"modal-dialog\"><div class=\"modal-content dashboardContainer\"><div class=\"modal-header\"><button type=\"submit\" class=\"close btn btn-default\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Finish",{"name":"getString","hash":{},"data":data}))
    + "</button><h4 class=\"modal-title cgText\"></h4></div><div class=\"modal-body\"></div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/dashboardCont.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"dashboardContainer\" class=\"bootstrap\"></div>";
},"useData":true});

this["JST"]["dest_temp/templates/dashboardNav.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"dashboardnav\" class=\"navigation congtooltip\" data-title=\""
    + alias4(((helper = (helper = helpers.app || (depth0 != null ? depth0.app : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"app","hash":{},"data":data}) : helper)))
    + "\"><button type=\"button\" class=\"btn btn-primary\" data-currapp=\""
    + alias4(((helper = (helper = helpers.app || (depth0 != null ? depth0.app : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"app","hash":{},"data":data}) : helper)))
    + "\"><i class=\"dashboard-icon cgIcon\"></i></button></div>";
},"useData":true});

this["JST"]["dest_temp/templates/documentSharing/dashboard.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " <div id=\"docsUploadMsz\" class=\"qq-gallery\"></div><div id=\"listnotes\" class=\"listPages pages col-sm-12\"></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return " <div class='dbContainer' data-app=\""
    + alias3(((helper = (helper = helpers.app || (depth0 != null ? depth0.app : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"app","hash":{},"data":data}) : helper)))
    + "\" id=\"docsDbCont\"><div id=\"docsListContainer\" class=\"col-sm-2\"><div id=\"listdocs\" class=\"listPages pages list-group\"></div><div id=\"newdocsBtnCont\"><button id=\"newDocBtn\" class=\"btn-default btn\"><span class=\"glyphicon glyphicon-upload\" title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Udocument",{"name":"getString","hash":{},"data":data}))
    + "\"></span><span class=\"uploadBtnTxt\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Udocument",{"name":"getString","hash":{},"data":data}))
    + "</span></button></div></div><div class=\"dashboardview col-sm-10\"><div id=\"docsuploadContainer\" class=\"col-sm-12\"></div> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControls : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/documentSharing/docsMain.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " ";
},"3":function(container,depth0,helpers,partials,data) {
    return " <p id=\"docMsgStudent\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"mybsharedoc",{"name":"getString","hash":{},"data":data}))
    + "</p> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"virtualclassDocumentShare\" class=\"virtualclass container\" data-screen=\"1\"><div id=\"docsPopupCont\" class=\"bootstrap\"></div><div id=\"documentScreen\" class=\"container\"><div id=\"docScreenContainer\"> "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + " </div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/documentSharing/docsNav.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return " <div class=\"link"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + " links list-group-item\" id=\"link"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + " \" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-selected=\"0\" data-status=\"1\"><div id=\"controlCont"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" class=\"controlCont\"><div class=\"controls status\" data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\"><a class=\"statusanch\">"
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "</a></div><div class=\"controls delete\"><a class=\"deleteanch\"></a></div></div><div class=\"mainpreview tooltip2\" id=\"mainpdocs"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" title=\""
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/documentSharing/notesMain.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return " <div id=\"note"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"note\" data-slide=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\"></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.notes : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["dest_temp/templates/documentSharing/notesNav.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return " <div class=\"linknotes links col-sm-2\" id=\"link"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" data-selected=\"0\" data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\" draggable=\"true\"><div class=\"mainpreview\" id=\"mainp"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-rid=\""
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\"><img class=\"thumbnail\" id=\"thumbnail"
    + alias4(((helper = (helper = helpers.rid || (depth0 != null ? depth0.rid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rid","hash":{},"data":data}) : helper)))
    + "\" src=\""
    + alias4(((helper = (helper = helpers.content_path || (depth0 != null ? depth0.content_path : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content_path","hash":{},"data":data}) : helper)))
    + "\"></div><div id=\"controlCont"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"controlCont\"><div class=\"controls status\" data-status=\""
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "\" title=\""
    + alias4(((helper = (helper = helpers.titleAction || (depth0 != null ? depth0.titleAction : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"titleAction","hash":{},"data":data}) : helper)))
    + "\"><a class=\"statusanch\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"status",{"name":"getString","hash":{},"data":data}))
    + alias4(((helper = (helper = helpers.status || (depth0 != null ? depth0.status : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"status","hash":{},"data":data}) : helper)))
    + "</a></div><div class=\"controls delete\" title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"delete",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"deleteanch\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"delete",{"name":"getString","hash":{},"data":data}))
    + "</a></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/documentSharing/screen.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " <span class=\"nvgt prev\" id=\"docsprev\"></span><span class=\"nvgt next\" id=\"docsnext\"></span> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return " <div id=\"screen-docs\" data-doc=\""
    + alias4(((helper = (helper = helpers.cd || (depth0 != null ? depth0.cd : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cd","hash":{},"data":data}) : helper)))
    + "\" class=\"screen page_wrapper current\"> "
    + alias4(((helper = (helper = helpers.debug || (depth0 != null ? depth0.debug : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"debug","hash":{},"data":data}) : helper)))
    + " <div class=\"pageContainer\"><div id=\"notesContainer\" class=\"notes\"> "
    + ((stack1 = container.invokePartial(partials.docNotesMain,depth0,{"name":"docNotesMain","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " </div> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControls : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div><div class=\"docPdfLoader\"></div></div>";
},"usePartial":true,"useData":true});

this["JST"]["dest_temp/templates/editor/edenableall.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"all"
    + alias4(((helper = (helper = helpers.type1 || (depth0 != null ? depth0.type1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type1","hash":{},"data":data}) : helper)))
    + "Container\" class=\"editorController congtooltip\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"oncollaboration",{"name":"getString","hash":{},"data":data}))
    + "\"><a id=\"all"
    + alias4(((helper = (helper = helpers.type1 || (depth0 != null ? depth0.type1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type1","hash":{},"data":data}) : helper)))
    + "ContainerAnch\" href=\"#\" data-action=\"enable\"><span class=\"cgText\"> "
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"collaborate",{"name":"getString","hash":{},"data":data}))
    + "</span></a></div>";
},"useData":true});

this["JST"]["dest_temp/templates/editor/editorrich.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"virtualclass"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" class=\"vmApp virtualclass "
    + alias4(((helper = (helper = helpers["class"] || (depth0 != null ? depth0["class"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"class","hash":{},"data":data}) : helper)))
    + "\"><div id=\"virtualclass"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Body\"></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/editor/messagebox.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"synchMessageBox\" width=\"340px\" height=\"15px\"><p id=\"readOnlyMsg\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"pleasewaitWhSynNewCont",{"name":"getString","hash":{},"data":data}))
    + "</p></div>";
},"useData":true});

this["JST"]["dest_temp/templates/joinclass.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"joinClass\" class=\"bootstrap\"><div class=\"container \"><div class=\"modal fade\" id=\"joinClassModal\" role=\"dialog\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-body\"><div class=\"joinClasscontainer text-center\"><div class=\"textCont\">Click here to continue</div><button type=\"button\" class=\"btn btn-default\">Continue</button></div></div></div></div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/leftBar.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.meetingMode : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + " ";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = container.invokePartial(partials.appToolsMeeting,depth0,{"name":"appToolsMeeting","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " ";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = container.invokePartial(partials.appTools,depth0,{"name":"appTools","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " ";
},"6":function(container,depth0,helpers,partials,data) {
    return " <span class=\"nvgt prev\"></span><span class=\"nvgt next\"></span> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"virtualclassAppLeftPanel\" class=\"leftbar hideZoom\" data-surname=\""
    + container.escapeExpression(((helper = (helper = helpers.meetingMode || (depth0 != null ? depth0.meetingMode : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"meetingMode","hash":{},"data":data}) : helper)))
    + "\"> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControls : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <div id=\"virtualclassAppContainer\"><div id=\"virtualclassWhiteboard\" class=\"virtualclass whiteboard\" style=\"display:none;\"><div class=\"whiteboardContainer\"></div> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControls : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div></div><a id=\"congrealogo\" href=\"https://www.congrea.com\" target=\"_blank\"><img src=\"https://cdn.congrea.net/resources/images/congrea_logo.svg\"></a><div id=\"docShareNav\"></div></div>";
},"usePartial":true,"useData":true});

this["JST"]["dest_temp/templates/main.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = container.invokePartial(partials.recordingControl,depth0,{"name":"recordingControl","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.precheck,depth0,{"name":"precheck","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " "
    + ((stack1 = container.invokePartial(partials.joinclass,depth0,{"name":"joinclass","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " <div id=\"virtualclassApp\" style=\"display: block;\" class=\"try-to-connect\"> "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isPlay : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = container.invokePartial(partials.rightBar,depth0,{"name":"rightBar","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " "
    + ((stack1 = container.invokePartial(partials.leftBar,depth0,{"name":"leftBar","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " "
    + ((stack1 = container.invokePartial(partials.popupCont,depth0,{"name":"popupCont","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " "
    + ((stack1 = container.invokePartial(partials.dashboardCont,depth0,{"name":"dashboardCont","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " </div>";
},"usePartial":true,"useData":true});

this["JST"]["dest_temp/templates/multiVideo.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"videoConfrence\"><div id=\"videosWrapper\"><div class=\"videoCont selfVideo\"><video class=\"videoBox multilocalVideo\" muted=\"muted\" autoplay></video></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/multiVideoMain.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"virtualclassMultiVideo\" class=\"virtualclass container\" data-screen=\"1\" style=\"display:none\"><div id=\"videoMainPreview\"><video id=\"multiVidSelected\" muted=\"muted\"></video></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/edit-modal.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return " <div class=\"inputWrapper clearfix\"><textarea rows=\"1\" id=\"option"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"key","hash":{},"data":data}) : helper)))
    + "\" class=\"opt form-control\" value=\""
    + alias1(container.lambda(depth0, depth0))
    + "\" style=\"width: 100%; float: left;\"></textarea></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block; padding-right: 0px;\"><div class=\"modal-dialog\"><div class=\"modal-content\" id=\"pollModalBody\"><div id=\"contHead\" class=\"modal-header\"><button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button><div id=\"editTx\" class=\"row modalHeaderTx panel-body\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"PEdit",{"name":"getString","hash":{},"data":data}))
    + "</div></div><div id=\"contBody\" class=\"modal-body\"><div id=\"qnTxCont\" class=\"row previewTxCont\" style=\"display: block;\"><label class=\"pollLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + "</label><div class=\"inputWrapper clearfix\"><textarea id=\"q\" class=\"qn form-control\" value=\""
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "\" rows=\"1\"></textarea></div></div><div id=\"optsTxCont\" class=\"row previewTxCont\" style=\"display: block;\"><label id=\"pollOptLabel\" class=\"pollLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Options",{"name":"getString","hash":{},"data":data}))
    + "</label> "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <div id=\"addMoreCont\" class=\"addMoreCont\"><span class=\"icon-plus\"></span><a href=\"#\" id=\"addMoreOption\" class=\"addMoreOption controls btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Addoption",{"name":"getString","hash":{},"data":data}))
    + "</a></div></div></div><div id=\"contFooter\" class=\"modal-footer\"><div id=\"footerCtrCont\"><button id=\"reset\" class=\"btn btn-default pull-left controls\" type=\"button\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Reset",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-reset\"></i></button><button id=\"etSave\" class=\"btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Save",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-save\"></i></button><button id=\"saveNdPublish\" class=\"btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Publish",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-publish\"></i></button></div></div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/modal.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block;\"><div class=\"modal-dialog\"><div class=\"modal-content\" id=\"pollModalBody\"><div id=\"contHead\" class=\"modal-header\"><button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button><div id=\"editTx\" class=\"row modalHeaderTx panel-body\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"createnewpoll",{"name":"getString","hash":{},"data":data}))
    + "</div></div><div id=\"contBody\" class=\"modal-body\"><div id=\"qnTxCont\" class=\"row pollTxCont\"><label class=\"pollLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + " :</label><div class=\"inputWrapper clearfix clearfix\"><textarea id=\"q\" class=\"qn form-control\" rows=\"1\" placeholder=\"Type question\"></textarea></div></div><div id=\"optsTxCont\" class=\"row pollTxCont\"><label class=\"optionLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Options",{"name":"getString","hash":{},"data":data}))
    + "</label><div class=\"inputWrapper clearfix\"><textarea id=\"1\" class=\"opt form-control\" placeholder=\"Type option\" rows=\"1\"></textarea></div><div class=\"inputWrapper clearfix\"><textarea id=\"2\" class=\"opt form-control\" rows=\"1\" placeholder=\"Type option\"></textarea></div><div id=\"addMoreCont\" class=\"addMoreCont\"><span class=\"icon-plus-circle\"></span><a href=\"#\" id=\"addMoreOption\" class=\"addMoreOption btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Addoption",{"name":"getString","hash":{},"data":data}))
    + "</a></div></div></div><div id=\"contFooter\" class=\"modal-footer\"><div id=\"footerCtrCont\"><button id=\"reset\" class=\"btn btn-default pull-left controls\" type=\"button\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Reset",{"name":"getString","hash":{},"data":data}))
    + "</button><button id=\"etSave\" class=\"btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Save",{"name":"getString","hash":{},"data":data}))
    + "</button><button id=\"saveNdPublish\" class=\"btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Publish",{"name":"getString","hash":{},"data":data}))
    + "</button></div></div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/optioninput.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " <a id=\"remove"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.close : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"close child\">×</a> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"inputWrapper clearfix\"><textarea rows=\"1\" id=\"option"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.close : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"opt form-control parent\" placeholder=\"Type option\"></textarea> "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.close : depth0)) != null ? stack1.closeBtn : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/pollStd.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return " <div><input class=\"opt\" name=\"option\" value=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\"radio\" id=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\"><span>"
    + alias4(container.lambda(depth0, depth0))
    + "</span></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"stdPollContainer\" class=\"container\"><div id=\"stdContHead\" class=\"panel\"><div class=\"stdHeader\"><label id=\"pollHead\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"pollHead",{"name":"getString","hash":{},"data":data}))
    + "</label></div><label id=\"timerLabel\"></label><div id=\"timerCont\"></div></div><div id=\"stdContBody\" class=\"panel\"><label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + " :<span id=\"stdQnCont\">"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.question : stack1), depth0))
    + "</span></label><div id=\"stdOptionCont\"> "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div></div><div id=\"stdContFooter\"><input id=\"btnVote\" type=\"button\" class=\"btn btn-primary\" value=\"Vote\"></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/pollmain.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return " <li role=\"presentation\" id=\"coursePollTab\" class=\"navListTab active\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"coursePoll",{"name":"getString","hash":{},"data":data}))
    + "\"><a href=\"#\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Cpoll",{"name":"getString","hash":{},"data":data}))
    + "</a></li><li role=\"presentation\" id=\"sitePollTab\" class=\"navListTab\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"sitePoll",{"name":"getString","hash":{},"data":data}))
    + "\"><a href=\"# \">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Spoll",{"name":"getString","hash":{},"data":data}))
    + "</a></li> ";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return " <li role=\"presentation\" id=\"pollResult\" class=\"navListTab\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"pollresult",{"name":"getString","hash":{},"data":data}))
    + "\"><a href=\"# \">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Presult",{"name":"getString","hash":{},"data":data}))
    + "</a></li><li role=\"presentation\" id=\"stdPollHeader\" class=\"navListTab\" data-content=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"poll",{"name":"getString","hash":{},"data":data}))
    + "\"> Poll </li> ";
},"5":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return " <div id=\"mszBoxPoll\" class=\"row\" style=\"display:none\"></div><div id=\"createPollCont\" class=\"createBtnCont\"><button id=\"newPollBtnsite\" class=\"btn btn-default site\" data-toogle=\"modal\" data-target=\"#editPollModal\" style=\"display: none;\"><i class=\"icon-create-new\"></i>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"addnew",{"name":"getString","hash":{},"data":data}))
    + "</button><button id=\"newPollBtncourse\" class=\"btn btn-default course\" data-toogle=\"modal\" data-target=\"#editPollModal\" style=\"display: block;\"><i class=\"icon-create-new\"></i>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"addnew",{"name":"getString","hash":{},"data":data}))
    + "</button></div><div id=\"bootstrapCont\" class=\"modalCont\"></div><div class=\"table-responsive\" id=\"listQnContcourse\"><table class=\"pollList table table-bordered table-striped table-fixed\"><thead><tr class=\" headerContainer\" id=\"headerContainercourse\"><th class=\"controlsHeader col-sm-2\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Controls",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-setting\"></i></th><th class=\"qnTextHeader col-sm-8\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"PQuestions",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-help\"></i></th><th class=\"creatorHeader col-sm-2\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Creator",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-creator\"></i></th></tr></thead></table></div><div class=\"table-responsive\" id=\"listQnContsite\" style=\"display: none;\"><table class=\"pollList table table-bordered table-striped\"><thead><tr class=\" headerContainer\" id=\"headerContainersite\"><th class=\"controlsHeader col-sm-2\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Controls",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-setting\"></i></th><th class=\"qnTextHeader col-sm-8\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"PQuestions",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-help\"></i></th><th class=\"creatorHeader col-sm-2\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Creator",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-creator\"></i></th></tr></thead></table></div> ";
},"7":function(container,depth0,helpers,partials,data) {
    return " <div id=\"mszBoxPoll\" class=\"row\"><div id=\"stdPollMszLayout\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"pollmybpublish",{"name":"getString","hash":{},"data":data}))
    + "</div></div><div id=\"bootstrapCont\" class=\"modalCont\"></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"virtualclassPoll\" class=\"virtualclass\"><div id=\"layoutPoll\" class=\"bootstrap container-fluid pollLayout\"><nav id=\"navigator\" class=\"nav navbar\"><ul class=\"nav nav-tabs pollNavBar\"> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + " </ul></nav><div id=\"layoutPollBody\" class=\"pollMainCont\"> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + " </div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/pollresultlist.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<table id=\"listViewTable\" class=\"table table-bordered\"><thead><tr><th>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"NAME",{"name":"getString","hash":{},"data":data}))
    + "</th><th>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"optselectd",{"name":"getString","hash":{},"data":data}))
    + "</th></tr></thead><tbody id=\"resultList\"></tbody></table>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/preview-modal.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " <div><span class=\"radio\"><input class=\"opt\" name=\"option\" value=\"1\" type=\"radio\" id=\"1\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</span></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block;\"><div class=\"modal-dialog\"><div class=\"modal-content\" id=\"pollModalBody\"><div id=\"contHead\" class=\"modal-header\"><button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button><div id=\"publishTx\" class=\"row modalHeaderTx panel-body\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ppoll",{"name":"getString","hash":{},"data":data}))
    + "</div></div><div id=\"contBody\" class=\"panel-body\"><label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + ":<span id=\"qnTxCont\" class=\"previewTxCont\">"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "</span></label><div id=\"optsTxCont\" class=\"previewTxCont\"> "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div></div><div id=\"contFooter\" class=\"modal-footer\"><div id=\"footerCtrCont\"><button id=\"goBack\" data-dismiss=\"modal\" class=\"btn btn-default controls\">&lt; "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Back",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-back\"></i></button><button id=\"next\" class=\"btn btn-default controls\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Publish",{"name":"getString","hash":{},"data":data}))
    + "<i class=\"icon-publish\"></i></button></div></div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/previewPopup.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return " <div class=\"viewOpt\"><input class=\"opt\" name=\"option\" value='"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "' type=\"radio\" id='"
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "' disabled><label>"
    + alias4(container.lambda(depth0, depth0))
    + "</label></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"popover-content\"><div id=\"popupCont\" class=\"pollPreview\"><div><div id=\"qnTxCont\" class=\"row previewTxCont\"><label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + " :</label><div class=\"viewQn\">"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "</div></div><div id=\"optsTxCont\" class=\"row previewTxCont\"><label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Options",{"name":"getString","hash":{},"data":data}))
    + " :</label> "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/qn.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=helpers.helperMissing;

  return "<tr id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"vcPollCont\"><td id=\"ctrQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"pollCtrCont col-sm-2\"><table class=\"miniTB\"><tr><td><div id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "E\" class=\"editCont pull-left\"><a href=\"#\" data-target=\"#editPollModal\" id=\"editQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\"><span class=\"icon-pencil2 controlIcon\" data-toggle=\"congtooltip\" title="
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"edit",{"name":"getString","hash":{},"data":data}))
    + "></span></a></div></td><td><div id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"deleteCont pull-left\"><a href=\"#\" id=\"deleteQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\"><span class=\"icon-bin22 controlIcon\" data-toggle=\"congtooltip\" title="
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"delete",{"name":"getString","hash":{},"data":data}))
    + "></span></a></div></td><td><div class=\"publishCont pull-left\" id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "P\"><a href=\"#\" id=\"publishQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\"><span class=\"icon-publish2 controlIcon\" data-toggle=\"congtooltip\" title="
    + alias2((helpers.getString || (depth0 && depth0.getString) || alias4).call(alias3,"Publish",{"name":"getString","hash":{},"data":data}))
    + "></span></a></div></td></tr></table></td><td id=\"qnText"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"qnText col-sm-8\" data-toggle=\"popover\" data-trigger=\"hover\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "</td><td class=\"creator col-sm-2\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.creator : stack1), depth0))
    + "</td></tr>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/qnOptions.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return " <div><input class=\"opt\" name=\"option\" value=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\"radio\" id=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\"><span>"
    + alias4(container.lambda(depth0, depth0))
    + "</span></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["dest_temp/templates/poll/result-modal.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return " <div><input class=\"opt\" name=\"option\" value=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\"radio\" id=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\"><span>"
    + alias4(container.lambda(depth0, depth0))
    + "</span></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block;\"><div class=\"modal-dialog\"><div class=\"modal-content\" id=\"pollModalBody\"><div id=\"contHead\" class=\"modal-header\"><button type=\"button\" class=\"close\" id=\"modalClose\">×</button><div id=\"resultTx\" class=\"row modalHeaderTx panel-body\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Presult",{"name":"getString","hash":{},"data":data}))
    + "</div></div><div id=\"resultLayout\" class=\"panel-body\"><div id=\"resultLayoutHead\" class=\"row panel\"><div id=\"timerWrapper\" class=\"col-md-4\"><label id=\"timerLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Rtime",{"name":"getString","hash":{},"data":data}))
    + "</label><div id=\"timerCont\"></div></div><div id=\"votesWrapper\" class=\"col-md-6\"><label id=\"congreaPollVoters\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"VotedSoFar",{"name":"getString","hash":{},"data":data}))
    + "</label><div id=\"receivedVotes\"></div></div></div><div id=\"resultLayoutBody\"><div id=\"TqnPoll\" class=\"panel\"><label>"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Question",{"name":"getString","hash":{},"data":data}))
    + " : <span id=\"qnLabelCont\">"
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.question : stack1), depth0))
    + "</span></label><div id=\"nonVotTqn\"> "
    + ((stack1 = helpers.each.call(alias1,((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div></div><div id=\"chartMenuCont\" class=\"panel\"><button id=\"bar\" class=\" btn btn-default\"><a href=\"#\" id=\"barView\"><span class=\"icon-stats-bars cgIcon\"></span></a></button><button id=\"pi\" class=\"btn btn-default\"><a href=\"#\" id=\"piView\"><span class=\"icon-pie-chart cgIcon\"></span></a></button><button id=\"rList\" class=\"btn btn-default\"><a href=\"#\" id=\"listView\"><span class=\"icon-list-ul cgIcon\"></span></a></button></div><div id=\"chart\" class=\"row c3\" style=\"max-height: 320px; position: relative;\"></div><div class=\"table-responsive\" id=\"listCont\" style=\"display:none\"></div></div><div id=\"pollResultMsz\" class=\"pollResultMsz panel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"watstdrespo",{"name":"getString","hash":{},"data":data}))
    + "</div><div id=\"resultLayoutFooter\" class=\"row\"></div></div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/setting-modal.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return " <option value=\""
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</option> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"modal-dialog\" id=\"yui_3_17_2_1_1496125638736_94\"><div class=\"modal-content\" id=\"pollModalBody\"><div id=\"contHead\" class=\"modal-header\"><button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button><div id=\"settingTx\" class=\"row modalHeaderTx panel-body\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"PSetting",{"name":"getString","hash":{},"data":data}))
    + "</div></div><div id=\"contBody\" class=\"modal-body\"><div id=\"settingCont\"><label class=\"pollLabel panel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ModeclosingPoll",{"name":"getString","hash":{},"data":data}))
    + " <span id=\"mode\" class=\"custom-controls-stacked panel\"><label class=\"custom-control custom-radio radio-inline\"><input type=\"radio\" name=\"option\" value=\"BY Instructor\" id=\"radioBtn1\" class=\"custom-control-input\"><span class=\"custom-control-indicator\"></span><span class=\"custom-control-description\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ByInstructor",{"name":"getString","hash":{},"data":data}))
    + "</span></label><label class=\"custom-control custom-radio radio-inline\"><input type=\"radio\" name=\"option\" value=\"BY Timer\" id=\"radioBtn2\" class=\"custom-control-input\" checked=\"checked\"><span class=\"custom-control-indicator\"></span><span class=\"custom-control-description\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ByTimer",{"name":"getString","hash":{},"data":data}))
    + "</span></label></span></label><div id=\"enTimer\" class=\"panel\"><label id=\"timerTx\" class=\"pollLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"SetTimer",{"name":"getString","hash":{},"data":data}))
    + " <span id=\"selTime\"><select id=\"timer\" name=\"timer\" class=\"form-control\" style=\"width: 100px; display: inline;\"> "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.time : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </select><select id=\"ut\" name=\"unit\" class=\"form-control\" style=\"width: 100px; display: inline;\"><option id=\"op1\" value=\"minut\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"minute",{"name":"getString","hash":{},"data":data}))
    + "</option><option id=\"op2\" value=\"second\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"second",{"name":"getString","hash":{},"data":data}))
    + "</option></select></span></label></div><div id=\"showRt\" class=\"form-group\"><label id=\"labelCk\" class=\"custom-control custom-checkbox \"><input type=\"checkbox\" id=\"pollCkbox\" class=\"custom-control-input \" checked=\"checked\"><span id=\"labelCk\" class=\"custom-control-description pollLabel\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Showresulttostudents",{"name":"getString","hash":{},"data":data}))
    + "</span></label></div></div></div><div id=\"contFooter\" class=\"modal-footer\"><div id=\"settingBtn\"><button id=\"cacelSetting\" class=\"btn btn-default\" data-dismiss=\"modal\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"cancel",{"name":"getString","hash":{},"data":data}))
    + "</button><button id=\"publish\" class=\"btn btn-default\" disable=\"true\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Publish",{"name":"getString","hash":{},"data":data}))
    + "</button></div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/poll/stdResult.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.escapeExpression;

  return "<div id=\"resultLayout\"><div id=\"resultLayoutHead\" class=\"stdrslt container\"><div id=\"timerWrapper\"><label id=\"timerLabel\">"
    + alias1((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Rtime",{"name":"getString","hash":{},"data":data}))
    + "</label><div id=\"timerCont\"></div></div><div id=\"votesWrapper\" class=\"modal-header\"></div></div><div id=\"resultLayoutBody\" class=\"container stdlayout\"><label>Question :<span id=\"qnLabelCont\">"
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.obj : depth0)) != null ? stack1.question : stack1), depth0))
    + "</span></label><div class=\"panel\"><div id=\"optnNonVotd\"></div></div><div id=\"chartMenuCont\" class=\"panel\"><button id=\"bar\" class=\"btn btn-default\"><a href=\"#\" id=\"barView\"><span class=\"icon-stats-bars cgIcon\"></span></a></button><button id=\"pi\" class=\"btn btn-default\"><a href=\"#\" id=\"piView\"><span class=\"icon-pie-chart cgIcon\"></span></a></button></div><div id=\"chart\" class=\"row c3\" style=\"display: none; max-height: 320px; position: relative;\"></div></div><div id=\"pollResultMsz\" class=\"pollResultMsz\"></div><div id=\"resultLayoutFooter\" class=\"row\"></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/popupCont.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"popupContainer\"><div id=\"about-modal\" class=\"rv-vanilla-modal\"><div id=\"recordingContainer\" class=\"popupWindow\"><div class=\"rv-vanilla-modal-header group\" id=\"recordingHeaderContainer\"><h2 class=\"rv-vanilla-modal-title cgText\" id=\"recordingHeader\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"uploadsession",{"name":"getString","hash":{},"data":data}))
    + "</h2></div><div class=\"rv-vanilla-modal-body\"><div id=\"progressContainer\"><div id=\"totProgressCont\"><div id=\"totalProgressLabel\" class=\"cgText\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"totalprogress",{"name":"getString","hash":{},"data":data}))
    + " </div><div id=\"progress\"><div id=\"progressBar\" class=\"progressBar\" style=\"width:0%;\"></div><div id=\"progressValue\" class=\"progressValue\"> 0%</div></div></div><div id=\"indvProgressCont\"><div id=\"indvProgressLabel\"class=\"cgText\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"indvprogress",{"name":"getString","hash":{},"data":data}))
    + " </div><div id=\"indProgress\"><div id=\"indProgressBar\" class=\"progressBar\"></div><div id=\"indProgressValue\" class=\"progressValue\"> 0%</div></div></div></div><div id=\"recordFinishedMessageBox\"><span id=\"recordFinishedMessage\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"uploadedsession",{"name":"getString","hash":{},"data":data}))
    + " </span><span id=\"recordingClose\" class=\"icon-close\"></span></div></div></div>  <div id=\"recordPlay\" class=\"popupWindow\"><div class=\"rv-vanilla-modal-body\"><div id=\"downloadPcCont\"><div id=\"downloadSessionText\" class=\"cgText\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"downloadsession",{"name":"getString","hash":{},"data":data}))
    + "</div><div id=\"downloadPrgressLabel\" class=\"cgText\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"overallprogress",{"name":"getString","hash":{},"data":data}))
    + " </div><div id=\"downloadProgress\"><div id=\"downloadProgressBar\" class=\"progressBar\"></div><div id=\"downloadProgressValue\" class=\"progressValue\"> 0% </div></div></div><div id=\"askPlay\"><div id=\"askplayMessage\"></div><button id=\"playButton\" class=\"icon-play cgText\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"play",{"name":"getString","hash":{},"data":data}))
    + "</button></div></div></div>  <div id=\"replayContainer\" class=\"popupWindow\"><p id=\"replayMessage\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"replay_message",{"name":"getString","hash":{},"data":data}))
    + "</p><div id=\"replayClose\" class=\"close icon-close\"></div><button id=\"replayButton\" class=\"icon-repeat cgText\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"replay",{"name":"getString","hash":{},"data":data}))
    + " </button></div>  <div id=\"confirm\" class=\"popupWindow simple-box\"></div>  <div id=\"sessionEndMsgCont\" class=\"popupWindow\"><span id=\"sessionEndClose\" class=\"icon-close\"></span><span id=\"sessionEndMsg\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"sessionendmsg",{"name":"getString","hash":{},"data":data}))
    + " </span></div><div id=\"uploadvideourl\" class=\"popupWindow urlValidation\"><span id=\"vidPopupClose\" class=\"icon-close urlMszClose \"></span><span id=\"vidUrlValidateTx\" class=\"validationMsz\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"validateurlmsg",{"name":"getString","hash":{},"data":data}))
    + " </span></div><div id=\"uploadppturl\" class=\"popupWindow urlValidation\"><span id=\"pptPopupClose\" class=\"icon-close urlMszClose\"></span><span id=\"pptUrlValidateTx\" class=\"validationMsz\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"validateurlmsg",{"name":"getString","hash":{},"data":data}))
    + " </span></div>  <div id=\"waitMsgCont\" class=\"popupWindow\"><span id=\"waitMsg\" class=\"cgText\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"waitmsgconnect",{"name":"getString","hash":{},"data":data}))
    + " </span></div><div id=\"chromeExtMiss\" class=\"popupWindow\"><span id=\"chromeExtClose\" class=\"icon-close\"></span><span id=\"chromeExtMissMsg\"> Congrea needs 'Desktop Selector' pugins to share the Screen.<br/>You can download the plugin <a href='https://chrome.google.com/webstore/detail/desktop-selector/ijhofagnokdeoghaohcekchijfeffbjl' target='_blank'>HERE.</a> After installing the plugin, please <a onclick=\"location.reload()\">Reload </a> the page. </span></span></div><div id=\"generalMessage\" class=\"popupWindow\"><span id=\"generalMessageMsg\"></span><span id=\"generalMessageClose\"></span></div><div id=\"generalMessageButton\" class=\"popupWindow\"><span class=\"button\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"JoinClassMsg",{"name":"getString","hash":{},"data":data}))
    + " </span></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/ppt/dashboard.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class='dbContainer' data-app=\""
    + alias3(((helper = (helper = helpers.app || (depth0 != null ? depth0.app : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"app","hash":{},"data":data}) : helper)))
    + "\" id=\"pptDbCont\"><div id=\"pptListContainer\"><div id=\"listppt\" class=\"listPages pages list-group\"></div></div><div class=\"dashboardview\"><div id=\"pptuploadContainer\"><div id=\"urlcontainer\" style=\"display: block;\" class=\"form-group\"><input id=\"presentationurl\" placeholder=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"EHTMLPresentUrl",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"form-control\"><input type=\"submit\" id=\"submitpurl\" class=\"btn-default\"value=\"Save\"></div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/ppt/linkPpt.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.escapeExpression;

  return " <div class=\"controls status\" data-status=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\" title=\""
    + alias1((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"disable",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"statusanch\"></a></div> ";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.escapeExpression;

  return " <div class=\"controls status\" data-status=\""
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\" title=\""
    + alias1((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"enable",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"statusanch\"></a></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<div class=\""
    + alias4(((helper = (helper = helpers.className || (depth0 != null ? depth0.className : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"className","hash":{},"data":data}) : helper)))
    + " row\" id=\"link"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-screen="
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + " data-rid=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-selected=\"0\" data-status=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\" draggable=\"true\"><div id=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Title"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" class=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Title tooltip2 col-md-9\"></div><div id=\"controlCont"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" class=\"controlCont col-md-3\"><div class=\"controls mainpreview\" id=\"mainp"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-rid=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Play",{"name":"getString","hash":{},"data":data}))
    + "\"></div> "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + " <div class=\"controls delete\" title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Delete",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"deleteanch\"></a></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/ppt/mszdisplay.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<p id=\"pptMessageLayout\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"preWllBshortly",{"name":"getString","hash":{},"data":data}))
    + "</p>";
},"useData":true});

this["JST"]["dest_temp/templates/ppt/ppt.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"virtualclassSharePresentation\" class=\"virtualclass\"> "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div>";
},"useData":true});

this["JST"]["dest_temp/templates/ppt/pptiframe.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"iframecontainer\"><iframe id=\"pptiframe\"></iframe></div>";
},"useData":true});

this["JST"]["dest_temp/templates/precheck.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4="function";

  return "<div id=\"virtualclassPreCheck\" class=\"bootstrap\"><div id=\"preCheckcontainer\"><div class=\"container \"><div class=\"modal fade\" id=\"myModal\" role=\"dialog\"><div class=\"modal-dialog modal-lg\"><div class=\"modal-content\"><div class=\"modal-body\"><div id=\"precheckSkip\" class=\"button clearfix\"><span class=\"skip\"></span></div><div id=\"preCheckProgress\"><ul class=\"progressbar\" id=\"congProgressbar\"><li class=\"screen1 browser active\"></li><li class=\"screen2 bandwidth\"></li><li class=\"screen5 speaker\"></li><li class=\"screen4 mic\"></li><li class=\"screen3 webcam\"></li></ul></div><div id=\"vcBrowserCheck\" class=\"precheck browser\"><div class=\"testName\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"testingbrowser",{"name":"getString","hash":{},"data":data}))
    + " </div><div class=\"result\"></div><div id=\"browserButtons\" class=\"button clearfix\"><button type=\"button\" class=\"next btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Next",{"name":"getString","hash":{},"data":data}))
    + "</button></div></div><div id=\"vcBandWidthCheck\" class=\"precheck bandwidth\"><div class=\"testName\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"testinginternetspeed",{"name":"getString","hash":{},"data":data}))
    + " </div><div class=\"result\"><img src=\"https://cdn.congrea.net/resources/images/progressbar.gif\"/></div><div id=\"bandwidthButtons\" class=\"button clearfix\"><button type=\"button\" class=\"prev btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Prev",{"name":"getString","hash":{},"data":data}))
    + "</button><button type=\"button\" class=\"next btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Next",{"name":"getString","hash":{},"data":data}))
    + "</button></div></div><div id=\"vcSpeakerCheck\" class=\"precheck speaker\"><div class=\"testName\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"testingspeaker",{"name":"getString","hash":{},"data":data}))
    + " </div><audio id=\"vcSpeakerCheckAudio\"><source src=\""
    + alias3(((helper = (helper = helpers.whiteboardPath || (depth0 != null ? depth0.whiteboardPath : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"whiteboardPath","hash":{},"data":data}) : helper)))
    + "resources/audio/audio_music.ogg\"><source src=\""
    + alias3(((helper = (helper = helpers.whiteboardPath || (depth0 != null ? depth0.whiteboardPath : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"whiteboardPath","hash":{},"data":data}) : helper)))
    + "resources/audio/audio-music.mp3\"></audio><div class=\"result\"></div><div id=\"speakerButtons\" class=\"button clearfix\"><button type=\"button\" class=\"prev btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Prev",{"name":"getString","hash":{},"data":data}))
    + "</button><button type=\"button\" class=\"next btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Next",{"name":"getString","hash":{},"data":data}))
    + "</button></div></div><div id=\"vcMicCheck\" class=\"precheck mic\"><div class=\"testName\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"testingmichrophone",{"name":"getString","hash":{},"data":data}))
    + "</div><div id=\"audioVisualaizerCont\"><canvas id=\"audioVisualaizer\" class=\"visualizer\" width=\"60\"></canvas></div><div class=\"result\"></div><div id=\"micButtons\" class=\"button clearfix\"><button type=\"button\" class=\"prev btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Prev",{"name":"getString","hash":{},"data":data}))
    + "</button><button type=\"button\" class=\"next btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Next",{"name":"getString","hash":{},"data":data}))
    + "</button></div></div><div id=\"vcWebCamCheck\" class=\"precheck webcam\"><div class=\"testName\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"testingwebcam",{"name":"getString","hash":{},"data":data}))
    + " </div><div id=\"webcamTempVideoCon\"><video id=\"webcamTempVideo\"></video></div><div class=\"result\"></div><div id=\"joinSession\" class=\"button clearfix\"><button type=\"button\" class=\"prev btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Prev",{"name":"getString","hash":{},"data":data}))
    + "</button><button type=\"button\" class=\"next btn btn-default\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"JoinSession",{"name":"getString","hash":{},"data":data}))
    + "</button></div></div></div></div></div></div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/recordingControl.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"playControllerMainCont\"><div id=\"playControllerCont\"><div id=\"playController\"><div id=\"recPlayCont\" class=\"recButton\"><button id=\"recPlay\" class=\"icon-play congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Play",{"name":"getString","hash":{},"data":data}))
    + "\"></button></div><div id=\"recPauseCont\" class=\"recButton \"><button id=\"recPause\" class=\"icon-pause congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Pause",{"name":"getString","hash":{},"data":data}))
    + "\"></button></div><div id=\"ff2Cont\" class=\"recButton\"><button id=\"ff2\" class=\"ff icon-forward congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"FF2",{"name":"getString","hash":{},"data":data}))
    + "\"></button></div><div id=\"ff8Cont\" class=\"recButton\"><button id=\"ff8\" class=\"ff icon-fast-forward congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"FF8",{"name":"getString","hash":{},"data":data}))
    + "\"></button></div><div id=\"replayFromStart\"><button class=\"ff icon-Replayfromstart congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Replay",{"name":"getString","hash":{},"data":data}))
    + "\"></button></div><div id=\"playProgress\"><div id=\"playProgressBar\" class=\"progressBar\" style=\"width: 0%;\"></div></div><div id=\"repTimeCont\"><span id=\"tillRepTime\">00:00</span> / <span id=\"totalRepTime\">00:00</span></div></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/rightBar.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing;

  return "<div id=\"virtualclassAppRightPanel\" class=\"rightbar bootstrap chat_enabled\"> "
    + ((stack1 = container.invokePartial((helpers.getVideoType || (depth0 && depth0.getVideoType) || alias2).call(alias1,{"name":"getVideoType","hash":{},"data":data}),depth0,{"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  "
    + ((stack1 = container.invokePartial(partials.audioWidget,depth0,{"name":"audioWidget","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  <div id=\"rightSubContainer\" class=\"\"> "
    + ((stack1 = container.invokePartial(partials.appSettingDetail,depth0,{"name":"appSettingDetail","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " <div id=\"chatWidget\"><div id=\"congreaChatMainCont\"><div id=\"congreaChatCont\"></div><div class=\"footerCtr\" id=\"congFooterCtr\"><div class=\"vmchat_search\" id=\"congchatBarInput\"><input type=\"text\" id=\"congreaUserSearch\" class=\"search\" placeholder=\""
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Searchuser",{"name":"getString","hash":{},"data":data}))
    + "\"></div></div></div><div id=\"stickycontainer\"></div></div></div></div>";
},"usePartial":true,"useData":true});

this["JST"]["dest_temp/templates/ssmainDiv.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.recImg : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + " ";
},"2":function(container,depth0,helpers,partials,data) {
    return " <div id=\"virtualclassScreenShareLocalTemp\"><canvas id=\"virtualclassScreenShareLocalTempVideo\" width=\"1440\" height=\"738\"></canvas></div> ";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return " <div id=\"virtualclassScreenShareLocal\" class=\"Local \" style=\"position: relative; width: 1536px; height: 677px;\"><video id=\"virtualclassScreenShareLocalVideo\" autoplay=\"true\" src=\" \"></video></div><div id=\"virtualclassScreenShareLocalSmall\" class=\"Local \"><video id=\"virtualclassScreenShareLocalVideosmall\" autoplay=\"true\" src=\" \"></video><h3 id=\"screenShrMsg\" class=\"alert alert-info\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(alias1,"screensharemsg",{"name":"getString","hash":{},"data":data}))
    + "</h3> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.scrctrl : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div> ";
},"5":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return " <div id=\"stopScreenShare\" class=\"ss\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ssStop",{"name":"getString","hash":{},"data":data}))
    + "\"><button type=\"button\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ssBtn",{"name":"getString","hash":{},"data":data}))
    + "</button></div> ";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " <div id=\"virtualclassScreenShareLocal\" class=\"Local\"><canvas id=\"virtualclassScreenShareLocalVideo\" width=\"886\" height=\"724\"></canvas></div> "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.scrctrl : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"8":function(container,depth0,helpers,partials,data) {
    return " <div id=\"screenController\"><div class=\"share selfView\"><button type=\"button\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"sharetoall",{"name":"getString","hash":{},"data":data}))
    + "</button></div></div> ";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.recImg : depth0),{"name":"unless","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"11":function(container,depth0,helpers,partials,data) {
    return " <div id=\"virtualclassScreenShareLocalTemp\"><canvas id=\"virtualclassScreenShareLocalTempVideo\" width=\"900\" height=\"740\"></canvas></div> ";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.scrctrl : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"virtualclassScreenShare\" class=\"virtualclass \"> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + " </div>";
},"useData":true});

this["JST"]["dest_temp/templates/teacherVideo.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " <video id=\"videoHostSource\" class=\"\" autoplay=\"\" muted=\"muted\"></video><canvas id=\"videoHost\"></canvas><canvas id=\"videoHostSlice\"></canvas> ";
},"3":function(container,depth0,helpers,partials,data) {
    return " <div id=\"fromServer\"><canvas id=\"videoParticipate\"></canvas></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"videoHostContainer\"> "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.hasControl : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + " </div>";
},"useData":true});

this["JST"]["dest_temp/templates/videoupload/linkvideo.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return " <div class=\"controls status\" data-status=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\" data-toggle=\"congtooltip\" title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"disable",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"statusanch\">status\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\"</a></div> ";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return " <div class=\"controls status\" data-status=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\" data-toggle=\"congtooltip\" title=\""
    + alias2((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"enable",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"statusanch\">status\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\"</a></div> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "<div class=\""
    + alias4(((helper = (helper = helpers.className || (depth0 != null ? depth0.className : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"className","hash":{},"data":data}) : helper)))
    + "\" id=\"link"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-screen="
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + " data-rid=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-selected=\"0\" data-status=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1), depth0))
    + "\" draggable=\"true\"><div class=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "TitleCont col-sm-9\" id=\"videoTitleCont"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\"><div id=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Title"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" class=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Title tooltip2\"></div><div class=\"controls edit\" data-toggle=\"congtooltip\" title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"edittitle",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"editanch\" id=\"editVideoTitle"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\"></a></div></div><div id=\"controlCont"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" class=\"controlCont col-sm-3\"><div class=\"controls mainpreview \" id=\"mainp"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-screen=\""
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\" data-toggle=\"congtooltip\" title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"clicktoplay",{"name":"getString","hash":{},"data":data}))
    + "\" data-rid=\""
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.rid : stack1), depth0))
    + "\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"clicktoplay",{"name":"getString","hash":{},"data":data}))
    + "</div> "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.dataset : depth0)) != null ? stack1.status : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + " <div class=\"controls delete\" data-toggle=\"congtooltip\" title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"delete",{"name":"getString","hash":{},"data":data}))
    + "\"><a class=\"deleteanch\">"
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"delete",{"name":"getString","hash":{},"data":data}))
    + "</a></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/videoupload/popup.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div id=\"videoPopup\" data-app=\"Video\" class=\"dbContainer\"><div id=\"uploadMsz\" class=\"qq-gallery\" style=\"display:none\"></div><div id=\"congreavideoContBody\"></div><div id=\"listvideo\"></div><div id=\"congreaShareVideoUrlCont\"><div id=\"uploadBtnCont\"><button type=\"button\" id=\"uploadVideo\" class=\"btn btn-default\"><span class=\" glyphicon glyphicon-upload videoupload-icon\" title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"uploadvideo",{"name":"getString","hash":{},"data":data}))
    + "\"></span><span class=\"videobtntxt\">"
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"uploadvideo",{"name":"getString","hash":{},"data":data}))
    + "</span></button></div><div id=\"videoUrlContainer\"><input id=\"videourl\" placeholder=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"enteryouryoutubeurl",{"name":"getString","hash":{},"data":data}))
    + "\"><button type=\"button\" id=\"submitURL\"class=\"btn btn-default\"><i class=\"icon-savevideo cgIcon\">Save</i></button></div></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/videoupload/videoupload.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " ";
},"3":function(container,depth0,helpers,partials,data) {
    return " <p id=\"messageLayoutVideo\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"Vwllbshrshortly",{"name":"getString","hash":{},"data":data}))
    + "</p> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"virtualclassVideo\" class=\"bootstrap virtualclass\" style=\"display: block;\"> "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + " <div id=\"videoPlayerCont\"></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/whiteboard/main.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = container.invokePartial(partials.whiteboardToolbar,depth0,{"name":"whiteboardToolbar","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"vcanvas"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"vcanvas socketon\" data-wb-id=\""
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\"><div id=\"containerWb"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"containerWb\"> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControl : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " <div id=\"canvasWrapper"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"canvasWrapper\"><canvas id=\"canvas"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\" width=\"730\" height=\"750\"> "
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"canvasmissing",{"name":"getString","hash":{},"data":data}))
    + " </canvas></div></div></div>";
},"usePartial":true,"useData":true});

this["JST"]["dest_temp/templates/whiteboard/toolbar.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"commandToolsWrapper"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"commandToolsWrapper\"><div id=\"t_rectangle"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"rectangle\"><a href=\"#\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Rectangle",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"congtooltip\"><span class=\"icon-rectangle cgIcon\"></span></a></div><div id=\"t_line"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"line\"><a href=\"#\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Line",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"congtooltip\"><span class=\"icon-line cgIcon\"></span></a></div><div id=\"t_freeDrawing"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"freeDrawing\"><a href=\"#\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Freehand",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"congtooltip\"><span class=\"icon-freeDrawing cgIcon\"></span></a></div><div id=\"t_oval"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"oval\"><a href=\"#\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Oval",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"congtooltip\"><span class=\"icon-oval cgIcon\"></span></a></div><div id=\"t_triangle"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"triangle\"><a href=\"#\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Triangle",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"congtooltip\"><span class=\"icon-triangle cgIcon\"></span></a></div><div id=\"t_text"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"text\"><a href=\"#\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"Text",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"congtooltip\"><span class=\"icon-text cgIcon\"></span></a></div><div id=\"t_activeall"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"activeAll\"><a href=\"#\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ActiveAll",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"congtooltip\"><span class=\"icon-activeAll cgIcon\"></span></a></div><div id=\"t_clearall"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"clearAll\"><a href=\"#\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"ClearAll",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"congtooltip\"><span class=\"icon-clearAll cgIcon\"></span></a></div><div id=\"t_color"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"color\"><a href=\"#\" data-title=\""
    + alias4((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"colorSelector",{"name":"getString","hash":{},"data":data}))
    + "\" class=\"congtooltip\"><input class=\"jscolor\" value=\"000000\"></a></div></div>";
},"useData":true});

this["JST"]["dest_temp/templates/youtube/yts.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return " "
    + ((stack1 = container.invokePartial(partials.ytscontrol,depth0,{"name":"ytscontrol","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + " ";
},"3":function(container,depth0,helpers,partials,data) {
    return " <p id=\"messageLayout\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"youtubewllbshrshortly",{"name":"getString","hash":{},"data":data}))
    + "</p> ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"virtualclassYts\" class=\"virtualclass\"><div id=\"player\"></div> "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hascontrol : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.createMsg : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " </div>";
},"usePartial":true,"useData":true});

this["JST"]["dest_temp/templates/youtube/ytscontrol.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"youtubeUrlContainer\"><input id=\"youtubeurl\" placeholder=\"Enter YouTube Video URL.\"><button id=\"submitURL\">"
    + container.escapeExpression((helpers.getString || (depth0 && depth0.getString) || helpers.helperMissing).call(depth0 != null ? depth0 : (container.nullContext || {}),"ShareYouTubeVideo",{"name":"getString","hash":{},"data":data}))
    + "</button></div>";
},"useData":true});

this["JST"]["dest_temp/templates/zoomControl.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"zoomControler\"><div class=\"zoomIn\"><span class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"zoomIn",{"name":"getString","hash":{},"data":data}))
    + "\"><i class=\"icon-zoonIn cgIcon\"></i></span></div><div class=\"zoomOut\"><span class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"zoomOut",{"name":"getString","hash":{},"data":data}))
    + "\"><i class=\"icon-zoomOut cgIcon\"></i></span></div><div class=\"fitScreen\"><span class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"fitToScreen",{"name":"getString","hash":{},"data":data}))
    + "\"><i class=\"icon-fitScreen cgIcon\"></i></span></div><div class=\"reloadNote\"><span class=\"congtooltip\" data-title=\""
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"reloadDoc",{"name":"getString","hash":{},"data":data}))
    + "\"><i class=\"icon-reloadDoc cgIcon\"></i></span></div></div>";
},"useData":true});