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

this["JST"]["templates/chat/chat.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"chatWidget\" style=\"height: 403px;\">\n  <div id=\"stickycontainer\">\n    <div class=\"chatBarTab\">\n      <div class=\"vmchat_room_bt tooltip\" data-title=\"Common Chat\" id=\"chatroom_bt2\">\n        <div class=\"inner_bt\">\n          <div id=\"chatroom_icon\">\n            <span class=\"icon-chatroom\"></span>\n          </div>\n          <div id=\"chatroom_text\">Chatroom</div>\n        </div>\n      </div>\n      <div class=\"vmchat_bar_button tooltip active\" id=\"user_list\" data-title=\"Pivate Chat\">\n        <div class=\"inner_bt\">\n          <div id=\"usertab_text\">\n            <span id=\"onlineusertext\">Users(1/8)</span>\n          </div>\n        </div>\n      </div>\n      <div class=\"vmchat_support notavailable tooltip\" id=\"congreaSupport\" data-title=\"Tech Support\">\n        <div class=\"support_bt\">\n          <div id=\"supporttab_icon\"></div>\n          <div id=\"supporttab_text\">support</div>\n        </div>\n      </div>\n    </div>\n    <div id=\"stickybar\" class=\"maximize\" style=\"z-index: 2000;\">\n      <div id=\"tabs\" class=\"tabs-bottom ui-tabs ui-widget ui-widget-content ui-corner-all\">\n        <ul class=\"tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all\"\n            role=\"tablist\"></ul>\n      </div>\n      <div class=\"footerCtr\" id=\"congFooterCtr\">\n        <div class=\"uiMuteAll\">\n          <a id=\"contrAudioAll\">\n            <span id=\"contrAudioAllImg\" data-action=\"disable\" class=\"icon-all-audio-disable tooltip\"\n                  data-title=\"Mute All\"></span>\n          </a>\n        </div>\n        <div class=\"prechk\" id=\"precheckTest\"><span class=\"precheck tooltip\" id=\"precheckSetting\">precheck</span>\n        </div>\n        <div class=\"videoSwitchCont\" id=\"congCtrBar\">\n          <div id=\"rightCtlr\">\n            <span id=\"videoSwitch\" class=\"video on\"></span>\n          </div>\n        </div>\n        <div class=\"vmchat_search\" id=\"congUserSearch\"><input type=\"text\" id=\"congreaUserSearch\" class=\"search\"\n                                                              placeholder=\"search user ...\"></div>\n      </div>\n    </div>\n  </div>\n  <div id=\"congreaChatCont\">\n    <div class=\"ui-widget ui-corner-top ui-memblist\" id=\"memlist\" style=\"display: block; right: -1px;\">\n      <div class=\"ui-widget-content ui-memblist-content\">\n        <div id=\"chat_div\" class=\"ui-widget-content ui-memblist-log\"\n             style=\"height: 363px; width: 320px; max-height: 403px;\">\n          <div class=\"userImg ui-memblist-usr mySelf teacher online\" id=\"ml2\" data-role=\"t\"><a href=\"#2\" class=\"tooltip\"\n                                                                                               data-title=\"Click to chat\"><img\n            src=\"https://local.vidya.io/moodle32/pluginfile.php/5/user/icon/f2\"></a>\n            <div class=\"user-details\">\n              <div class=\"usern\"><span>Admin User</span></div>\n            </div>\n          </div>\n          <div class=\"userImg ui-memblist-usr offline student\" id=\"ml8\" data-role=\"undefined\">\n            <a href=\"#8\"\n               class=\"tooltip\"\n               data-title=\"Click to chat\"><img\n              src=\"https://local.vidya.io/moodle32/pluginfile.php/55/user/icon/f2\"></a>\n            <div class=\"user-details\">\n              <div class=\"usern\"><span>student6 user6 </span></div>\n              <div id=\"8ControlContainer\" class=\"controls\">\n                <div id=\"8contrAssignCont\" class=\"controleCont\"><a id=\"8contrAssignAnch\" class=\"tooltip\"\n                                                                   data-title=\"Transfer Controls\"><span\n                  id=\"8contrAssignImg\" data-assign-disable=\"false\" class=\"icon-assignImg enable assignImg\"></span></a>\n                </div>\n                <div id=\"8contrAudCont\" class=\"controleCont\"><a id=\"8contrAudAnch\"             class=\"tooltip\"\n                                                                data-title=\"Mute\"><span id=\"8contrAudImg\"\n                                                                                        data-audio-disable=\"false\"\n                                                                                        class=\"icon-audioImg enable audioImg\"></span></a>\n                </div>\n                <div id=\"8contrChatCont\" class=\"controleCont\"><a id=\"8contrChatAnch\" class=\"tooltip\"\n                                                                 data-title=\"Disable Chat\"><span id=\"8contrChatImg\"\n                                                                                                 data-chat-disable=\"false\"\n                                                                                                 class=\"icon-chatImg enable chatImg\"></span></a>\n                </div>\n                <div id=\"8contreditorRichCont\" class=\"controleCont controllereditorRich\" style=\"display: none;\"><a\n                  id=\"8contreditorRichAnch\" class=\"tooltip\" data-title=\"Write Mode\"><span id=\"8contreditorRichImg\"\n                                                                                          data-editorrich-disable=\"true\"\n                                                                                          class=\"icon-editorRichImg block editorRichImg\"></span></a>\n                </div>\n                <div id=\"8contreditorCodeCont\" class=\"controleCont controllereditorCode\" style=\"display: none;\"><a\n                  id=\"8contreditorCodeAnch\" class=\"tooltip\" data-title=\"Write Mode\"><span id=\"8contreditorCodeImg\"\n                                                                                          data-editorcode-disable=\"true\" class=\"icon-editorCodeImg block editorCodeImg\"></span></a>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/chat/chatCont.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"ui-widget ui-corner-top ui-memblist\" id=\"memlist\" style=\"display: block; right: -1px; z-index: 0;\">\n  <div class=\"ui-widget-content ui-memblist-content\" id=\"yui_3_17_2_1_1496901386584_68\">\n    <div id=\"chat_div\" class=\"ui-widget-content ui-memblist-log\"\n         style=\"height: 389px; width: 320px; max-height: 429px;\">\n\n    </div>\n  </div>\n</div>\n<div class=\"ui-widget ui-corner-top ui-chatroom enable\" id=\"chatrm\"\n     style=\"width: 304px; left: 6px; display: none; z-index: 1;\">\n  <div class=\"ui-widget-content ui-chatbox-content\" id=\"yui_3_17_2_1_1496901386584_77\">\n    <div id=\"chat_room\" class=\"ui-widget-content ui-chatbox-log\"></div>\n    <div class=\"ui-widget-content ui-chatbox-input\" id=\"yui_3_17_2_1_1496901386584_76\">\n      <textarea class=\"ui-widget-content ui-chatbox-input-box\" id=\"ta_chrm\" style=\"width: 290px;\"></textarea>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/chat/chatMain.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"ui-widget ui-corner-top ui-memblist\" id=\"memlist\" style=\"display: block; right: -1px; z-index: 0;\">\n  <div class=\"ui-widget-content ui-memblist-content\" id=\"yui_3_17_2_1_1496901386584_68\">\n    <div id=\"chat_div\" class=\"ui-widget-content ui-memblist-log\"\n         style=\"height: 389px; width: 320px; max-height: 429px;\">\n\n    </div>\n  </div>\n</div>\n<div class=\"ui-widget ui-corner-top ui-chatroom enable\" id=\"chatrm\"\n     style=\"width: 304px; left: 6px; display: none; z-index: 1;\">\n  <div class=\"ui-widget-content ui-chatbox-content\" id=\"yui_3_17_2_1_1496901386584_77\">\n    <div id=\"chat_room\" class=\"ui-widget-content ui-chatbox-log\"></div>\n    <div class=\"ui-widget-content ui-chatbox-input\" id=\"yui_3_17_2_1_1496901386584_76\">\n      <textarea class=\"ui-widget-content ui-chatbox-input-box\" id=\"ta_chrm\" style=\"width: 290px;\"></textarea>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/chat/chatbox.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li id=\"tabcb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"ui-state-default ui-corner-bottom ui-tabs-active ui-state-active\" aria-controls=\"tabcb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><a\n  href=\"#tabcb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"ui-tabs-anchor\">Admin User </a> <a href=\"#\" role=\"button\" class=\"ui-corner-all ui-chatbox-icon\"><span\n  class=\"ui-icon icon-close\"></span></a>\n  <div class=\"ui-widget ui-corner-top ui-chatbox\" id=\"cb"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" style=\"width: 230px;\">\n    <div class=\"ui-widget-header ui-corner-top ui-chatbox-titlebar ui-dialog-header\"><span>Admin User </span><a href=\"#\"\n                                                                                                                class=\"ui-chatbox-icon\"\n                                                                                                                role=\"button\"><span\n      class=\"ui-icon icon-close\"></span></a><a href=\"#\" class=\"ui-chatbox-icon\" role=\"button\"><span\n      class=\"ui-icon icon-minus\"></span></a>\n    </div>\n    <div class=\"ui-widget-content ui-chatbox-content\" id=\"yui_3_17_2_1_1496992871757_60\">\n      <div id=\""
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
    + "contrAssignAnch\" class=\"tooltip\"\n       data-title=\"Transfer Controls\">\n      <span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAssignImg\" data-assign-disable=\"false\"\n            class=\"icon-assignImg enable assignImg\">\n      </span>\n    </a>\n  </div>\n  <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudCont\" class=\"controleCont\">\n    <a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudAnch\" class=\"tooltip\" data-title=\"Mute\">\n      <span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrAudImg\" data-audio-disable=\"false\" class=\"icon-audioImg enable audioImg\"></span>\n    </a>\n  </div>\n  <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatCont\" class=\"controleCont\">\n    <a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatAnch\" class=\"tooltip\" data-title=\"Disable Chat\"><span\n      id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contrChatImg\" data-chat-disable=\"false\" class=\"icon-chatImg enable chatImg\"></span>\n    </a>\n  </div>\n  <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichCont\" class=\"controleCont controllereditorRich\" style=\"display: none;\">\n    <a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichAnch\" class=\"tooltip\" data-title=\"Write Mode\">\n      <span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorRichImg\" data-editorrich-disable=\"true\"\n            class=\"icon-editorRichImg block editorRichImg\"></span>\n    </a>\n  </div>\n  <div id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeCont\" class=\"controleCont controllereditorCode\" style=\"display: none;\">\n    <a id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeAnch\" class=\"tooltip\" data-title=\"Write Mode\">\n          <span id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "contreditorCodeImg\" data-editorcode-disable=\"true\"\n                class=\"icon-editorCodeImg block editorCodeImg\">\n          </span>\n    </a>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/chat/chatuser.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "      <div id=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "ControlContainer\" class=\"controls\">\n      </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"userImg ui-memblist-usr offline student\" id=\"ml"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "\" data-role=\"student\">\n  <a href=\"#"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.userid : stack1), depth0))
    + "\" class=\"tooltip\" data-title=\"Click to chat\">\n    <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.img : stack1), depth0))
    + "\">\n  </a>\n  <div class=\"user-details\">\n    <div class=\"usern\">\n      <span>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.name : stack1), depth0))
    + " "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.lname : stack1), depth0))
    + "</span>\n    </div>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.peer : depth0)) != null ? stack1.notSelf : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n</div>";
},"useData":true});

this["JST"]["templates/chat/stickycont.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"chatBarTab\">\n  <div class=\"vmchat_room_bt tooltip\" data-title=\"Common Chat\" id=\"chatroom_bt2\">\n    <div class=\"inner_bt\">\n      <div id=\"chatroom_icon\"><span class=\"icon-chatroom\"></span></div>\n      <div id=\"chatroom_text\">Chatroom</div>\n    </div>\n  </div>\n  <div class=\"vmchat_bar_button tooltip active\" id=\"user_list\" data-title=\"Pivate Chat\">\n    <div class=\"inner_bt\" id=\"yui_3_17_2_1_1496985300499_68\">\n      <div id=\"usertab_text\"><span id=\"onlineusertext\">Private Chat</span></div>\n    </div>\n  </div>\n  <div class=\"vmchat_support notavailable tooltip\" id=\"congreaSupport\" data-title=\"Tech Support\">\n    <div class=\"support_bt\">\n      <div id=\"supporttab_icon\"></div>\n      <div id=\"supporttab_text\">Support</div>\n    </div>\n  </div>\n</div>\n<div id=\"stickybar\" class=\"maximize\" style=\"z-index: 2000;\">\n  <div id=\"tabs\" class=\"tabs-bottom ui-tabs ui-widget ui-widget-content ui-corner-all\">\n    <ul class=\"tabs ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all\"\n        role=\"tablist\"></ul>\n  </div>\n  <div class=\"footerCtr\" id=\"congFooterCtr\">\n    <div class=\"uiMuteAll\">\n      <a id=\"contrAudioAll\">\n          <span id=\"contrAudioAllImg\" data-action=\"disable\"\n                class=\"icon-all-audio-disable tooltip\"\n                data-title=\"Mute All\">\n\n          </span>\n      </a>\n    </div>\n    <div class=\"prechk\" id=\"precheckTest\">\n      <span class=\"precheck tooltip\" id=\"precheckSetting\">precheck</span>\n    </div>\n    <div class=\"videoSwitchCont\" id=\"congCtrBar\">\n      <div id=\"rightCtlr\">\n        <span id=\"videoSwitch\" class=\"video on\"></span>\n      </div>\n    </div>\n    <div class=\"vmchat_search\" id=\"congUserSearch\">\n      <input type=\"text\" id=\"congreaUserSearch\" class=\"search\"\n             placeholder=\"search user ...\">\n    </div>\n  </div>\n</div>\n";
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

this["JST"]["templates/editor/edenableall.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id = \"all"
    + alias4(((helper = (helper = helpers.type1 || (depth0 != null ? depth0.type1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type1","hash":{},"data":data}) : helper)))
    + "Container\" class = \"editorController\">\n    <a id =\"all"
    + alias4(((helper = (helper = helpers.type1 || (depth0 != null ? depth0.type1 : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type1","hash":{},"data":data}) : helper)))
    + "ContainerAnch\" href = \"#\" data-action = \"enable\">\n        Enable All\n    </a>\n</div>";
},"useData":true});

this["JST"]["templates/editor/editorrich.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"virtualclass"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "\" class=\"vmApp virtualclass "
    + alias4(((helper = (helper = helpers["class"] || (depth0 != null ? depth0["class"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"class","hash":{},"data":data}) : helper)))
    + "\">\n<div id=\"virtualclass"
    + alias4(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data}) : helper)))
    + "Body\">\n\n</div>\n</div>";
},"useData":true});

this["JST"]["templates/editor/messagebox.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id = \"synchMessageBox\" width = \"340px\" height = \"15px\">\n    <p id=\"readOnlyMsg\">\n        Please wait a while.  Syncing new content.\n    </p>\n</div>";
},"useData":true});

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

this["JST"]["templates/poll/edit-modal.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=container.escapeExpression;

  return "            <div class=\"inputWrapper clearfix\">\n              <textarea rows=\"1\" id=\"option"
    + alias1(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"key","hash":{},"data":data}) : helper)))
    + "\" class=\"opt form-control\" value=\""
    + alias1(container.lambda(depth0, depth0))
    + "\"\n                        style=\"width: 97%; float: left;\"></textarea>\n            </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block; padding-right: 0px;\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\" id=\"pollModalBody\">\n      <div id=\"contHead\" class=\"modal-header\">\n        <button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button>\n        <div id=\"editTx\" class=\"row modalHeaderTx\">Poll Edit</div>\n      </div>\n      <div id=\"contBody\" class=\"modal-body\">\n        <div id=\"qnTxCont\" class=\"row previewTxCont\" style=\"display: block;\"><label class=\"pollLabel\">Question :</label>\n          <div class=\"inputWrapper clearfix\">\n            <textarea id=\"q\" class=\"qn form-control\" value=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "\" rows=\"1\"></textarea>\n          </div>\n        </div>\n        <div id=\"optsTxCont\" class=\"row previewTxCont\" style=\"display: block;\">\n          <label id=\"pollOptLabel\" class=\"pollLabel\">Options :</label>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "          <div id=\"addMoreCont\" class=\"addMoreCont\">\n            <span class=\"icon-plus\"></span>\n            <a href=\"#\" id=\"addMoreOption\" class=\"addMoreOption controls\">Add Option</a>\n          </div>\n        </div>\n      </div>\n      <div id=\"contFooter\" class=\"modal-footer\">\n        <div id=\"footerCtrCont\">\n          <button id=\"reset\" class=\"btn btn-default pull-left controls\" type=\"button\">Reset<i class=\"icon-reset\"></i>\n          </button>\n          <button id=\"etSave\" class=\"btn btn-default controls\">Save<i class=\"icon-save\"></i></button>\n          <button id=\"saveNdPublish\" class=\"btn btn-default controls\">Save and Publish<i class=\"icon-publish\"></i>\n          </button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/modal.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block;\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\" id=\"pollModalBody\">\n      <div id=\"contHead\" class=\"modal-header\">\n        <button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button>\n        <div id=\"editTx\" class=\"row modalHeaderTx\">Create New Poll</div>\n      </div>\n      <div id=\"contBody\" class=\"modal-body\">\n        <div id=\"qnTxCont\" class=\"row pollTxCont\">\n          <label class=\"pollLabel\">Question :</label>\n          <div class=\"inputWrapper clearfix clearfix\">\n            <textarea id=\"q\" class=\"qn form-control\" rows=\"1\" placeholder=\"Type question\"></textarea>\n          </div>\n        </div>\n        <div id=\"optsTxCont\" class=\"row pollTxCont\">\n          <label class=\"optionLabel\">Options :</label>\n          <div class=\"inputWrapper clearfix\">\n            <textarea id=\"1\" class=\"opt form-control\" placeholder=\"Type option\" rows=\"1\"></textarea>\n          </div>\n          <div class=\"inputWrapper clearfix\">\n            <textarea id=\"2\" class=\"opt form-control\" rows=\"1\" placeholder=\"Type option\"></textarea>\n          </div>\n          <div id=\"addMoreCont\" class=\"addMoreCont\">\n            <span class=\"icon-plus-circle\"></span>\n            <a href=\"#\" id=\"addMoreOption\" class=\"addMoreOption controls\">Add Option</a>\n          </div>\n        </div>\n      </div>\n      <div id=\"contFooter\" class=\"modal-footer\">\n        <div id=\"footerCtrCont\">\n          <button id=\"reset\" class=\"btn btn-default pull-left controls\" type=\"button\">Reset</button>\n          <button id=\"etSave\" class=\"btn btn-default controls\">Save</button>\n          <button id=\"saveNdPublish\" class=\"btn btn-default controls\">Save and Publish</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/optioninput.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"inputWrapper clearfix\">\n  <textarea rows=\"1\" id=\"option"
    + alias4(((helper = (helper = helpers.seq || (depth0 != null ? depth0.seq : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"seq","hash":{},"data":data}) : helper)))
    + "\" class=\"opt form-control\" placeholder=\"Type option\"\n            style=\"width: 97%; float: left;\"></textarea>\n  <a id=\"remove"
    + alias4(((helper = (helper = helpers.seq || (depth0 != null ? depth0.seq : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"seq","hash":{},"data":data}) : helper)))
    + "\" class=\"close\">×</a>\n</div>\n";
},"useData":true});

this["JST"]["templates/poll/pollStd.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <div>\n          <input class=\"opt\" name=\"option\" value=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" type=\"radio\" id=\""
    + alias4(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"key","hash":{},"data":data}) : helper)))
    + "\">\n          <label>"
    + alias4(container.lambda(depth0, depth0))
    + "</label>\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"stdPollContainer\" class=\"container\">\n  <div id=\"stdContHead\" class=\"row\">\n    <label id=\"timerLabel\"></label>\n    <div id=\"timerCont\"></div>\n  </div>\n  <div id=\"stdContBody\" class=\"row\">\n    <div id=\"stdQnCont\" class=\"row\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.question : stack1), depth0))
    + "</div>\n    <div id=\"stdOptionCont\" class=\"row\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n  <div id=\"stdContFooter\" class=\"row\">\n    <input id=\"btnVote\" class=\"btn btn-primary\" value =\"vote\">\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/pollmain.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "          <li role=\"presentation\" id=\"coursePollTab\" class=\"navListTab active\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"Polls you will create are course specific\" data-original-title=\"\" title=\"\">\n            <a href=\"#\">Course Poll</a>\n          </li>\n          <li role=\"presentation\" id=\"sitePollTab\" class=\"navListTab\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"Polls created here are of site level\" data-original-title=\"\" title=\"\">\n            <a href=\"# \">Site Poll</a>\n          </li>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "          <li role=\"presentation\" id=\"pollResult\" class=\"navListTab\" data-toggle=\"popover\" data-trigger=\"hover\" data-content=\"show result\" data-original-title=\"\" title=\"\">\n            <a href=\"# \">Poll Result</a>\n          </li>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "        <div id=\"mszBoxPoll\" class=\"row\">\n          <div class=\"emptyList\" id=\"emptyListcourse\">Create Your course Poll </div>\n        </div>\n        <div id=\"bootstrapCont\" class=\"modalCont\">\n\n        </div>\n\n        <div id=\"listQnContcourse\" class=\"row pollList\" style=\"display:block;\">\n          <div class=\"row headerContainer col-md-12\" id=\"headerContainercourse\">\n            <div class=\"controlsHeader col-md-2\">Controls<i class=\"icon-setting\"></i></div>\n            <div class=\"qnTextHeader col-md-8\">Poll Questions<i class=\"icon-help\"></i></div>\n            <div class=\"creatorHeader col-md-2\">Creator<i class=\"icon-creator\"></i></div>\n          </div>\n        </div>\n        <div id=\"listQnContsite\" class=\"row pollList\" style=\"display: none;\">\n          <div class=\"row headerContainer col-md-12\" id=\"headerContainersite\">\n            <div class=\"controlsHeader col-md-2\">Controls<i class=\"icon-setting\"></i></div>\n            <div class=\"qnTextHeader col-md-8\">Poll Questions<i class=\"icon-help\"></i></div>\n            <div class=\"creatorHeader col-md-2\">Creator<i class=\"icon-creator\"></i></div>\n          </div>\n        </div>\n\n        <div id=\"createPollCont\" class=\"createBtnCont\">\n          <button id=\"newPollBtnsite\" class=\"btn btn-default site\" data-toogle=\"modal\" data-target=\"#editPollModal\" style=\"display: none;\">Create New<i class=\"icon-create-new\"></i></button>\n          <button id=\"newPollBtncourse\" class=\"btn btn-default course\" data-toogle=\"modal\" data-target=\"#editPollModal\" style=\"display: block;\">Create New<i class=\"icon-create-new\"></i></button>\n        </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "        <div id=\"mszBoxPoll\" class=\"row\">\n          <div id=\"stdPollMszLayout\">Poll may be published ...</div>\n        </div>\n        <div id=\"bootstrapCont\" class=\"modalCont\">\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"virtualclassPoll\" class=\"virtualclass\">\n  <div id=\"layoutPoll\" class=\"bootstrap container-fluid pollLayout\">\n    <nav id=\"navigator\" class=\"nav navbar\">\n      <ul class=\"nav nav-tabs pollNavBar\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "      </ul>\n\n    </nav>\n    <div id=\"layoutPollBody\" class=\"pollMainCont\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/pollresultlist.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<table id=\"listViewTable\" class=\"table table-bordered\">\n  <thead>\n  <tr>\n    <th>NAME</th>\n    <th>OPTION SELECTED</th>\n  </tr>\n  </thead>\n  <tbody id=\"resultList\">\n\n  </tbody>\n</table>";
},"useData":true});

this["JST"]["templates/poll/preview-modal.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "            <div>\n              <input class=\"opt\" name=\"option\" value=\"1\" type=\"radio\" id=\"1\"><label>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</label>\n            </div>\n\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"editPollModal\" class=\"modal in\" tab-index=\"-1\" area-hidden=\"true\" style=\"display: block;\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\" id=\"pollModalBody\">\n      <div id=\"contHead\" class=\"modal-header\">\n        <button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button>\n        <div id=\"publishTx\" class=\"row modalHeaderTx\">Publish Poll</div>\n      </div>\n      <div id=\"contBody\" class=\"modal-body\">\n        <div id=\"qnTxCont\" class=\"row previewTxCont\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "</div>\n        <div id=\"optsTxCont\" class=\"row previewTxCont\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.poll : depth0)) != null ? stack1.options : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n      </div>\n      <div id=\"contFooter\" class=\"modal-footer\">\n        <div id=\"footerCtrCont\">\n          <button id=\"goBack\" data-dismiss=\"modal\" class=\"btn btn-default controls\">&lt; Back<i class=\"icon-back\"></i>\n          </button>\n          <button id=\"next\" class=\"btn btn-default controls\">Go to Publish<i class=\"icon-publish\"></i></button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/poll/qn.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"row vcPollCont col-md-12\">\n  <div id=\"ctrQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"col-md-2 pollCtrCont\">\n    <div class=\"pollCtrContainer\">\n      <div id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "E\" class=\"editCont pull-left\">\n        <a href=\"#\" data-target=\"#editPollModal\" id=\"editQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\">\n          <span class=\"icon-pencil2\" data-toggle=\"tooltip\" title=\"edit poll\"></span>\n        </a>\n      </div>\n      <div id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"deleteCont pull-left\">\n        <a href=\"#\" id=\"deleteQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\">\n          <span class=\"icon-bin22\" data-toggle=\"tooltip\" title=\"delete poll\"></span>\n        </a>\n      </div>\n      <div class=\"publishCont pull-left\" id=\"contQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "P\">\n        <a href=\"#\" id=\"publishQn"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\">\n          <span class=\"icon-publish2\" data-toggle=\"tooltip\" title=\"publish poll\"></span>\n        </a>\n      </div>\n    </div>\n  </div>\n  <div id=\"qnText"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.pollType : stack1), depth0))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.index : stack1), depth0))
    + "\" class=\"qnText col-md-8\" data-toggle=\"popover\" data-trigger=\"hover\"\n       data-original-title=\"\" title=\"\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.questiontext : stack1), depth0))
    + "</div>\n  <div class=\"creator col-md-2\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.pollQn : depth0)) != null ? stack1.creator : stack1), depth0))
    + "</div>\n</div>\n";
},"useData":true});

this["JST"]["templates/poll/result-modal.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"modal-dialog\" id=\"yui_3_17_2_1_1496125638736_94\">\n  <div class=\"modal-content\" id=\"pollModalBody\">\n    <div id=\"contHead\" class=\"modal-header\">\n      <button type=\"button\" class=\"close\" id=\"modalClose\">×</button>\n\n      <div id=\"resultTx\" class=\"row modalHeaderTx\">Poll Result</div>\n    </div>\n    <div id=\"resultLayout\">\n      <div id=\"resultLayoutHead\" class=\"row\">\n        <div id=\"timerWrapper\" class=\"col-md-6\">\n          <label id=\"timerLabel\">Remaining Time</label>\n          <div id=\"timerCont\"></div>\n        </div>\n        <div id=\"votesWrapper\" class=\"col-md-6\">\n          <label id=\"congreaPollVoters\">Voted So Far</label>\n          <div id=\"receivedVotes\"></div>\n        </div>\n      </div>\n      <div id=\"resultLayoutBody\" class=\"row\">\n        <div id=\"qnLabelCont\" class=\"row\"></div>\n        <div id=\"chartMenuCont\" class=\"row\">\n          <div id=\"bar\" class=\"col-sm-1\">\n            <a href=\"#\" id=\"barView\">\n              <span class=\"icon-stats-bars\"></span>\n            </a>\n          </div>\n          <div id=\"pi\" class=\"col-sm-1\">\n            <a href=\"#\" id=\"piView\">\n              <span class=\"icon-pie-chart\"></span>\n            </a>\n          </div>\n          <div id=\"rList\" class=\"col-sm-1\">\n            <a href=\"#\" id=\"listView\">\n              <span class=\"icon-list-ul\"></span>\n            </a>\n          </div>\n        </div>\n        <div id=\"chart\" class=\"row c3\" style=\"max-height: 320px; position: relative;\"></div>\n        <div class=\"table-responsive\" id=\"listCont\"></div>\n\n      </div>\n      <div id=\"pollResultMsz\" class=\"pollResultMsz\">Waiting for student response.....</div>\n      <div id=\"resultLayoutFooter\" class=\"row\">\n\n      </div>\n    </div>\n  </div>\n</div>";
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
    var stack1;

  return "<div class=\"modal-dialog\" id=\"yui_3_17_2_1_1496125638736_94\">\n  <div class=\"modal-content\" id=\"pollModalBody\">\n    <div id=\"contHead\" class=\"modal-header\">\n      <button type=\"button\" class=\"close\" id=\"modalClose\" data-dismiss=\"modal\">×</button>\n      <div id=\"settingTx\" class=\"row modalHeaderTx\">Poll Setting</div>\n    </div>\n    <div id=\"contBody\" class=\"modal-body\">\n      <div id=\"settingCont\" class=\"row\">\n        <div class=\"pollLabel\">Mode of closing Poll :</div>\n        <div id=\"mode\" class=\"custom-controls-stacked\">\n          <label class=\"custom-control custom-radio\">\n            <input type=\"radio\" name=\"option\" value=\"BY Instructor\" id=\"radioBtn1\" class=\"custom-control-input\">\n            <span class=\"custom-control-indicator\">\n\n              </span><span class=\"custom-control-description\">By Instructor</span>\n          </label>\n          <label class=\"custom-control custom-radio\">\n            <input type=\"radio\" name=\"option\" value=\"BY Timer\" id=\"radioBtn2\" class=\"custom-control-input\" checked=\"checked\">\n            <span class=\"custom-control-indicator\"></span>\n            <span class=\"custom-control-description\">By Timer</span>\n          </label>\n        </div>\n        <div id=\"enTimer\">\n          <div id=\"timerTx\" class=\"pollLabel\">Set Timer</div>\n          <div id=\"selTime\">\n            <select id=\"timer\" name=\"timer\" class=\"form-control\" style=\"width: 100px; display: inline;\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.time : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n            </select>\n            <select id=\"ut\" name=\"unit\" class=\"form-control\" style=\"width: 100px; display: inline;\">\n              <option id=\"op1\" value=\"minut\">minut</option>\n              <option id=\"op2\" value=\"second\">second</option>\n            </select>\n          </div>\n        </div>\n        <div id=\"showRt\" class=\"form-group\">\n          <label id=\"labelCk\" class=\"custom-control custom-checkbox \">\n            <input type=\"checkbox\" id=\"pollCkbox\" class=\"custom-control-input \" checked=\"checked\">\n            <span id=\"labelCk\" class=\"custom-control-description pollLabel\">show result to students</span>\n          </label>\n        </div>\n      </div>\n    </div>\n    <div id=\"contFooter\" class=\"modal-footer\">\n      <div id=\"settingBtn\">\n        <button id=\"cacelSetting\" class=\"btn btn-default\" data-dismiss=\"modal\">cancel</button>\n        <button id=\"publish\" class=\"btn btn-default\" disable=\"true\">Publish</button>\n      </div>\n    </div>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["templates/poll/stdResult.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"resultLayout\">\n  <div id=\"resultLayoutHead\" class=\"row\">\n    <div id=\"timerWrapper\" class=\"col-md-6\">\n      <label id=\"timerLabel\">Remaining Time</label>\n      <div id=\"timerCont\"></div>\n    </div>\n    <div id=\"votesWrapper\" class=\"col-md-6\">\n      <label id=\"congreaPollVoters\">Voted So Far</label>\n      <div id=\"receivedVotes\"></div>\n    </div>\n  </div>\n  <div id=\"resultLayoutBody\" class=\"row\">\n    <div id=\"qnLabelCont\" class=\"row\"></div>\n    <div id=\"chartMenuCont\" class=\"row\">\n      <div id=\"bar\" class=\"col-sm-1\">\n        <a href=\"#\" id=\"barView\">\n          <span class=\"icon-stats-bars\"></span>\n        </a>\n      </div>\n      <div id=\"pi\" class=\"col-sm-1\">\n        <a href=\"#\" id=\"piView\">\n          <span class=\"icon-pie-chart\"></span>\n        </a>\n      </div>\n    </div>\n    <div id=\"chart\" class=\"row c3\" style=\"display: none; max-height: 320px; position: relative;\"></div>\n  </div>\n  <div id=\"pollResultMsz\" class=\"pollResultMsz\"></div>\n  <div id=\"resultLayoutFooter\" class=\"row\">\n  </div>\n</div>";
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
    + " </span>\n    </div>\n\n    <div id=\"waitMsgCont\" class=\"popupWindow\">\n      <span id=\"waitMsg\"> "
    + alias3((helpers.getString || (depth0 && depth0.getString) || alias2).call(alias1,"waitmsgconnect",{"name":"getString","hash":{},"data":data}))
    + " </span>\n    </div>\n\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/ppt/mszdisplay.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<p id=\"pptMessageLayout\">Presentation will be shared shortly</p>";
},"useData":true});

this["JST"]["templates/ppt/ppt.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "    <div id=\"urlcontainer\" style=\"display: block;\">\n      <input id=\"presentationurl\" placeholder=\"Enter HTML5 Presentation Url.\">\n      <input type=\"submit\" id=\"submitpurl\" value=\"submit\">\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"virtualclassSharePresentation\" class=\"virtualclass\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.control : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["templates/ppt/pptiframe.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"iframecontainer\" style=\"height: 90%; width: 100%; display: block;\">\n  <iframe id=\"pptiframe\" style=\"height: 100%; width: 100%;\">\n  </iframe>\n</div>\n";
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

this["JST"]["templates/ssmainDiv.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.recImg : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    return "      <div id=\"virtualclassScreenShareLocalTemp\">\n        <canvas id=\"virtualclassScreenShareLocalTempVideo\" width=\"1440\" height=\"738\"></canvas>\n      </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "      <div id=\"virtualclassScreenShareLocal\" class=\"Local \" style=\"position: relative; width: 1536px; height: 677px;\">\n        <video id=\"virtualclassScreenShareLocalVideo\" autoplay=\"true\" src=\" \"></video>\n      </div>\n";
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
    + "\">\n  <div id=\"containerWb"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"containerWb\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasControl : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      <div id=\"canvasWrapper"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\">\n      <canvas id=\"canvas"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" tabindex=\"0\" width=\"730\" height=\"750\">\n        Canvas is missing in your browsers. Please update the latest version of your browser\n      </canvas>\n    </div>\n  </div>\n</div>";
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
    + "\" class=\"tool\" data-tool=\"freeDrawing\">\n    <a href=\"#\" data-title=\"Free hand\" class=\"tooltip\"> <span class=\"icon-freeDrawing\"></span></a>\n  </div>\n\n  <div id=\"t_oval"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"oval\">\n    <a href=\"#\" data-title=\"Oval\" class=\"tooltip\"> <span class=\"icon-oval\"></span></a>\n  </div>\n\n  <div id=\"t_triangle"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"triangle\">\n    <a href=\"#\" data-title=\"Triangle\" class=\"tooltip\"> <span class=\"icon-triangle\"></span></a>\n  </div>\n\n  <div id=\"t_text"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"text\">\n    <a href=\"#\" data-title=\"Text\" class=\"tooltip\"> <span class=\"icon-text\"></span></a>\n  </div>\n\n  <div id=\"t_activeall"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"activeAll\">\n    <a href=\"#\" data-title=\"Active All\" class=\"tooltip\"> <span class=\"icon-activeAll\"></span></a>\n  </div>\n\n  <div id=\"t_clearall"
    + alias4(((helper = (helper = helpers.cn || (depth0 != null ? depth0.cn : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cn","hash":{},"data":data}) : helper)))
    + "\" class=\"tool\" data-tool=\"clearAll\">\n    <a href=\"#\" data-title=\"Clear All\" class=\"tooltip\"> <span class=\"icon-clearAll\"></span></a>\n  </div>\n</div>";
},"useData":true});

this["JST"]["templates/youtube/yts.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.ytscontrol,depth0,{"name":"ytscontrol","data":data,"indent":"    ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    return "    <p id=\"messageLayout\">YouTube video will be shared shortly.</p>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div id=\"virtualclassYts\" class=\"virtualclass\">\n  <div id=\"player\"></div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hascontrol : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.createMsg : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"usePartial":true,"useData":true});

this["JST"]["templates/youtube/ytscontrol.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"youtubeUrlContainer\">\n  <input id=\"youtubeurl\" placeholder=\"Enter YouTube Video URL.\">\n  <button id=\"submitURL\">Share YouTube Video</button>\n</div>";
},"useData":true});