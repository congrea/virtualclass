(function (window) {
    var colorSelector = {
        // to be made dynamic
        makeThemeReady: function () {
            var color = virtualclassSetting.theme.selectedColor;
            var brightness = virtualclass.vutil.calcBrightness(color);
            var iconColor;
            if (brightness > 125) {
                iconColor = "black";
            } else {
                iconColor = "white";
            }

            var allbg = {};
            var active = {};
            var hover = {};


            hover.fcolor = chroma(color).brighten().hex();
            hover.scolor = chroma(color).brighten(1.8).hex();
            // to be modified
            if (brightness < 50) {
                if (brightness <= 10) {
                    active.fcolor = chroma(color).brighten(2).hex();
                    active.scolor = chroma(color).brighten(3).hex();
                } else {
                    active.fcolor = chroma(color).darken().hex();
                    active.scolor = chroma(color).darken(2).hex();
                }

            } else {
                if (brightness > 180) {
                    active.fcolor = chroma(color).darken(1.5).hex();
                    active.scolor = chroma(color).darken(1.1).hex();

                    hover.fcolor = chroma(color).darken(.5).hex();
                    hover.scolor = chroma(color).darken(.8).hex();

                } else {
                    active.fcolor = chroma(color).darken(.8).hex();
                    active.scolor = chroma(color).darken(.6).hex();

                    hover.fcolor = chroma(color).brighten().hex();
                    hover.scolor = chroma(color).brighten(1.8).hex();
                }

            }

            allbg.fcolor = color;
            allbg.scolor = chroma(color).brighten().hex();

            var frontColor = iconColor;
            active.frontColor = iconColor;
            hover.frontColor = iconColor;

            this.makeThemeReadyMainCont(frontColor, allbg, active, hover);
            this.makeThemeReadyEditor(frontColor, allbg, active, hover)
            this.makeThemeReadyRightPanel(frontColor, allbg, active, hover);
            this.makeThemeReadyVideo(frontColor, allbg, active, hover, brightness);
            this.makeThemeReadyPoll(frontColor, allbg, active, hover, brightness);
            this.makeThemeReadyPresentation(frontColor, allbg, active, hover, brightness);
            this.makeThemeReadyDocument(frontColor, allbg, active, hover);

            this.lightColorCustomize(frontColor, allbg, active, hover, brightness)
        },

        lightColorCustomize: function (frontColor, allbg, active, hover, brightness) {


            if (brightness >= 218) {
                allbg.fcolor = chroma(allbg.fcolor).darken(.4).hex();
                allbg.scolor = chroma(allbg.fcolor).darken().hex();

            }

            var border = "0.05em solid " + allbg.fcolor
            var css =
                "#virtualclassCont.congrea #virtualclassOptionsCont .appOptions, #virtualclassCont.congrea #audioWidget" +
                "{border-top:" + border + " !important;}" +
                "#virtualclassCont.congrea .containerWb .commandToolsWrapper .shapesToolbox .shapesTool .tool a" +
                "{border-bottom:" + border + " !important;}" +
                "#virtualclassCont.congrea .containerWb .commandToolsWrapper .shapesToolbox .shapes_icon a" +
                "{border-left: 0.01em solid " + allbg.fcolor + "!important;}" +
                // "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassWhiteboardTool" +
                // "{border:0 !important;}"+
                "#virtualclassCont.congrea #audioWidget li" +
                "{border-right:" + border + " !important;}" +
                "#virtualclassCont.congrea #virtualclassAppRightPanel #chatWidget .chatBarTab, #virtualclassCont.congrea #audioWidget .audioTool, #virtualclassCont.congrea #networkStatusContainer, " +
                "#virtualclassCont.congrea #alleditorRichContainerAnch" +
                "{border-left:" + border + " !important;}" +
                "#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool a ," +
                "#virtualclassCont.congrea #audioWidget li," +
                "#virtualclassCont.congrea #virtualclassAppRightPanel #chatWidget .chatBarTab li " +
                "{border-right: 0.01em solid " + allbg.fcolor + "!important;}" +
                "#virtualclassCont.congrea .ui-widget-header.ui-corner-top.ui-chatbox-titlebar.ui-dialog-header" +
                "{border: 0.02em solid " + allbg.fcolor + "!important;}" +
                "#virtualclassCont.congrea .btn.btn-default ," +
                "#virtualclassCont.congrea .vceditor-toolbar ," +
                "#virtualclassCont.congrea #virtualclassAppRightPanel #chatWidget .chatBarTab," +
                "#virtualclassCont.congrea #stickybar .footerCtr .vmchat_search #congreaUserSearch ," +
                "#virtualclassCont.congrea #layoutQuiz .navbar ," +
                "#virtualclassCont.congrea button ," +
                "#virtualclassCont.congrea #alleditorRichContainer #alleditorRichContainerAnch," +
                // "#virtualclassCont.congrea .btn.btn-default ,"+
                "#virtualclassCont.congrea .zoomControler ," +
                "#virtualclassCont.congrea .btn-default " +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important;}" +
                "#virtualclassCont.congrea .shapesToolbox" +
                "{border-right: 0.01em solid " + allbg.fcolor + "!important;}"

            this.addCss(css);

        },

        // front color to be calculated
        calcBrightness: function (color) {
            var rgb = chroma(color).rgb();
            var c = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
            var brightness = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
            console.log("brightne" + brightness);
            //alert(brightness);
            return brightness
        },

        makeThemeReadyMainCont: function (frontColor, allbg, active, hover) {

            var css = "#virtualclassCont.congrea .ui-widget-header" +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important} " +

                "#virtualclassCont.congrea #virtualclassAppLeftPanel #dashboardnav .btn" +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important} " +

                "#virtualclassCont.congrea #virtualclassAppLeftPanel #dashboardnav .btn.clicked" +
                "{background-image: linear-gradient(to bottom, " + active.fcolor + " 0%," + active.scolor + " 100%) !important} " +

                "#virtualclassCont.congrea #navigator, " +
                "#virtualclassCont.congrea #layoutQuiz .navbar, " +
                "#virtualclassCont.congrea .commandToolsWrapper, " +
                "#virtualclassCont.congrea .commandToolsWrapper .shapesToolbox .shapesTool," +
                "#virtualclassCont.congrea .commandToolsWrapper ul.strkSizeList li:hover," +
                "#virtualclassCont.congrea #virtualclassAppContainer .virtualclass .commandToolsWrapper .tool ul.strkSizeList li.selected," +
                "#virtualclassCont.congrea #virtualclassAppContainer .virtualclass .commandToolsWrapper .tool ul.fontSizeList span.selected," +
                "#virtualclassCont.congrea #playButton, " +
                "#virtualclassCont.congrea #recordPlay .rv-vanilla-modal-body #downloadPcCont #downloadSessionText" +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important} " +


                "#virtualclassCont.congrea #virtualclassOptionsCont:first-child " +
                "{background-image: linear-gradient(to right, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%)} " +

                "#virtualclassCont.congrea .commandToolsWrapper" +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%)} " +
                "#virtualclassCont.congrea #virtualclassOptionsCont .appOptions.active, " +
                "#virtualclassCont.congrea .commandToolsWrapper .tool.active a " +
                "{background-image: radial-gradient(ellipse at center, " + active.fcolor + " 0%," + active.scolor + " 100%);} " +
                "#virtualclassCont.congrea .tool.active a span:before " +
                "{color:" + frontColor + "!important}" +
                "#virtualclassCont.congrea #virtualclassOptionsCont .appOptions:hover, " +
                "#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool a:hover, " +
                "#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool ul.fontSizeList span:hover," +
                "#virtualclassCont.congrea #confirmCancel #confirmCancelButton:hover, " +
                "#virtualclassCont.congrea #alleditorRichContainer:hover, " +
                "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton:hover" +
                "{background-image: radial-gradient(ellipse at center, " + hover.fcolor + " 0%," + hover.scolor + " 100%) !important}" +

                "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton," +
                "#virtualclassCont.congrea #confirm.popupWindow #confirmCancel #confirmCancelButton" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea .appOptions:hover .cgIcon:before" +
                "{color:" + hover.frontColor + "!important}" +

                "#virtualclassCont.congrea .active .cgIcon:before" +
                "{color:" + active.frontColor + "!important}" +

                "#virtualclassCont.congrea .commandToolsWrapper .tool:hover .cgIcon:before" +
                "{color:" + hover.frontColor + "!important}" +

                "#virtualclassCont.congrea .cgIcon:before" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea #docShareNav #totalPages" +
                "{color:" + frontColor + "!important}" +

//            "#virtualclassCont.congrea #dcPaging .noteIndex"+
//            "{color:"+frontColor+"!important}"+

                "#virtualclassCont.congrea #docShareNav .pageNav" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea #docShareNav #dcPaging #stdPageNo" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool a" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea .shapesToolbox a" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea .shapes_icon .icon-shapes.cgIcon:after" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea .cgText" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea .vchead" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea .icon-publish2:before" +
                "{color:" + active.fcolor + "!important}" +

                "#virtualclassCont.congrea button ," +
                "#virtualclassCont.congrea .btn-default " +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important } " +

                "#virtualclassCont.congrea #congdashboard .modal-header .close" +
                "{opacity :1;}" +

                "#virtualclassCont.congrea .modal-header .btn-default ," +
                "#virtualclassCont.congrea .modal .btn-default ," +
                "#virtualclassCont.congrea .precheck .btn-default " +
                "{color :" + frontColor + "!important} " +

                "#virtualclassCont.congrea .vjs-control-bar .vjs-autoPlay-button " +
                "{background:none !important ;}" +
                "#virtualclassCont.congrea .vjs-control-bar .vjs-button " +
                "{background:none !important ; border:none !important ;color:white!important}" +

                "#virtualclassCont.congrea  #onlineusertext:before" +
                "{color :" + frontColor + "!important} " +

                "#virtualclassCont.congrea  #recordPlay #playButton:before" +
                "{color :" + frontColor + "!important} " +

                "#virtualclassCont.congrea #recordingHeaderContainer  " +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important ;color:" + frontColor + "!important} " +
                "#virtualclassCont.congrea  #virtualclassApp .playControllerMainCont " +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important ;color:" + frontColor + "!important} " +

                "#virtualclassCont.congrea  .dbContainer .qq-cancel-button-selector" +
                "{color :" + frontColor + "!important} " +
                " #virtualclassCont.congrea #virtualclassOptionsCont .appOptions " +
                "{border : 1px solid" + allbg.fcolor + "!important} " +
                "{background-image: linear-gradient(to bottom, " + active.fcolor + " 0%," + active.scolor + " 100%) !important ;color:" + frontColor + "!important} " +
                "{border-left: 1px solid " + allbg.fcolor + "!important}" +
                "#virtualclassCont.congrea #screenController .share button," +
                "#virtualclassCont.congrea #stopScreenShare button" +
                "{border-right:1px solid " + active.fcolor + "!important}" +
                "#virtualclassCont.congrea #screenController .share button:hover," +
                "#virtualclassCont.congrea #stopScreenShare button:hover " +
                "{background-image: linear-gradient(to bottom, " + hover.fcolor + " 0%," + hover.scolor + " 100%) !important;color:" + frontColor + "!important}" +
                "#virtualclassCont.congrea  #playController button" +
                "{background-image:none !important;color:" + frontColor + "!important; border-right: 1px solid " + allbg.fcolor + "!important}" +
                "#virtualclassCont.congrea #virtualclassAppLeftPanel .containerWb .commandToolsWrapper .shapesToolbox.active" +
                "{background-image: radial-gradient(ellipse at center, " + active.fcolor + " 0%," + active.scolor + " 100%);} ";
            this.addCss(css);

        },


        makeThemeReadyEditor: function (frontColor, allbg, active, hover) {

            var css = "#virtualclassCont.congrea a.vceditor-btn" +
                "#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool ul.fontSizeList span.selected," +
                "{background-color: " + active.fcolor + "} " +

                "#virtualclassCont.congrea a.vceditor-btn" +
                "{color: " + active.frontColor + "} " +

                "#virtualclassCont.congrea #alleditorRichContainer" +
                "{background-color: " + active.frontColor + "} " +

                "#virtualclassCont.congrea .vceditor-toolbar" +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important} " +

                "#virtualclassCont.congrea a.vceditor-btn:hover" +
                "{color:" + hover.frontColor + "!important}" +

                "#virtualclassCont.congrea a.vceditor-btn:hover" +
                "{background-image: radial-gradient(ellipse at center, " + hover.fcolor + " 0%," + hover.scolor + " 100%) !important}" +

                "#virtualclassCont.congrea .commandToolsWrapper .tool.active a" +
                "{background-image: radial-gradient(ellipse at center, " + active.fcolor + " 0%," + active.scolor + " 100% !important)} " +
                "#virtualclassCont .vceditor-dropdown-menu a:hover" +
                "{background-color:" + allbg.fcolor + "!important}";

            this.addCss(css);


        },


        makeThemeReadyRightPanel: function (frontColor, allbg, active, hover) {
            var css = "#virtualclassCont.congrea #recordPlay .rv-vanilla-modal-body #downloadPcCont #downloadSessionText," +
                "#virtualclassCont.congrea #virtualclassAppRightPanel #audioWidget" +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important}" +
                "#virtualclassCont.congrea #chatWidget .chatBarTab" +
                "{background: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important}" +

                "#virtualclassCont.congrea #stickycontainer .inner_bt:hover, " +
                "#virtualclassCont.congrea #stickycontainer .stdRaiseHand:hover, " +
                "#virtualclassCont.congrea #stickycontainer #contrAudioAll:hover, " +
                "#virtualclassCont.congrea #virtualclassAppRightPanel #mainAudioPanel li:hover, " +
                "#virtualclassCont.congrea #virtualclassAppRightPanel #mainAudioPanel li a:hover," +
                "#virtualclassCont.congrea #audioWidget #speakerPressOnce:hover," +
                "#virtualclassCont.congrea #audioTest-box:hover," +
                "#virtualclassCont.congrea #playButton:hover, " +
                "#virtualclassCont.congrea #alwaysPress:hover" +
                "{background-image: radial-gradient(ellipse at center, " + hover.fcolor + " 0%," + hover.scolor + " 100%) !important}" +

                "#virtualclassCont.congrea .vmchat_support.active ," +
                "#virtualclassCont.congrea .vmchat_room_bt.active," +
                "#virtualclassCont.congrea .vmchat_bar_button.active, " +
                "#virtualclassCont.congrea #virtualclassAppRightPanel #audioWidget .settingActive," +
                "#virtualclassCont.congrea #virtualclassAppRightPanel #stickycontainer .handRaise.disable" +
                "{background-image: radial-gradient(ellipse at center, " + active.fcolor + " 0%," + active.scolor + " 100%) !important}" +

                "#virtualclassCont.congrea #virtualclassAppRightPanel li:hover .cgIcon:before" +
                "{color:" + hover.frontColor + "!important}" +

                "#virtualclassCont.congrea #virtualclassAppRightPanel #appSettingCtrlAnchor span" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea #virtualclassAppRightPanel li:hover .cgText" +
                "{color:" + hover.frontColor + "!important}" +

                "#virtualclassCont.congrea #virtualclassAppRightPanel .handRaise.enable #icHr:before" +
                "{color:" + frontColor + "!important}" +

                "#virtualclassCont.congrea #virtualclassAppRightPanel .pre-check-btn" +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important ;color:" + frontColor + "!important} ";
            this.addCss(css);

        },

        makeThemeReadyVideo: function (frontColor, allbg, active, hover, brightness) {
            var iconColor = allbg.fcolor;
            if (brightness > 180) {
                iconColor = active.fcolor;

            }

            var css = "#virtualclassCont.congrea .ui-widget-header," +
                "#virtualclassCont.congrea #congdashboard .modal-header " +
                "{background-image: linear-gradient(to bottom, " + allbg.fcolor + " 0%," + allbg.scolor + " 100%) !important}" +
                "#virtualclassCont.congrea #listvideo .linkvideo .videoTitleCont:before, " +
                "#virtualclassCont.congrea #listvideo .linkvideo .controls .editanch:before, " +
                "#virtualclassCont.congrea #listvideo .linkvideo .controls:before{color:" + iconColor + "!important}" +
                "#virtualclassCont.congrea #listvideo .linkvideo .controls:hover:before{color:" + hover.fcolor + "!important}" +
                "#virtualclassCont.congrea #VideoDashboard button{color:" + frontColor + "!important}" +
                "#virtualclassCont.congrea #VideoDashboard button{border:1px solid" + frontColor + "!important}" +
                "{background-color: " + active.frontColor + "!important} " +
                "#virtualclassCont.congrea #listvideo .linkvideo.playing{border:solid " + allbg.fcolor + " 1px!important}";
            this.addCss(css);
        },

        makeThemeReadyPoll: function (frontColor, allbg, active, hover, brightness) {
            var iconColor = allbg.fcolor;
            if (brightness > 180) {
                iconColor = active.fcolor;

            }

            var css = "#virtualclassCont.congrea #virtualclassPoll .btn.btn-default, " +

                "#virtualclassCont.congrea #virtualclassPoll #stdPollContainer #btnVote" +
                "{color:" + frontColor + ";}" +
                "#virtualclassCont.congrea .bootstrap .pollNavBar > li > a {color:" + frontColor + " ; }" +
                "#virtualclassCont.congrea .bootstrap .navListTab:hover" +
                "{color:" + hover.frontColor + "!important;}" +
                "#virtualclassCont.congrea #virtualclassPoll #chartMenuCont a, " +
                "#virtualclassCont.congrea #virtualclassPoll .controlIcon:before" +
                "{color:" + iconColor + "!important}" +
                "#virtualclassCont.congrea #virtualclassPoll .controlIcon:hover:before{color:" + hover.fcolor + "!important}" +
                "#virtualclassCont.congrea #virtualclassPoll #navigator #stdPollHeader" +
                "{color:" + frontColor + "!important;}" +
                "#virtualclassCont.congrea #virtualclassPoll .modal button.close ," +
                "#virtualclassCont.congrea  .alert .close " +
                "{background-image: none !important ;background-color:none !important}";

            this.addCss(css);
        },
        makeThemeReadyPresentation: function (frontColor, allbg, active, hover, brightness) {
            var iconColor = allbg.fcolor;
            // if(brightness >180){
            if (brightness > 180) {
                iconColor = active.fcolor;
                hover.fcolor = chroma(active.fcolor).darken();
            }


            var css = "#virtualclassCont.congrea #SharePresentationDashboard .btn-default" +
                "{color:" + frontColor + "!important;}" +
                "#virtualclassCont.congrea #virtualclassPoll #chartMenuCont a, " +
                "#virtualclassCont.congrea #SharePresentationDashboard .controls:before{color:" + iconColor + "!important}" +
                "#virtualclassCont.congrea #SharePresentationDashboard .controls:hover:before{color:" + hover.fcolor + "!important}";
            this.addCss(css);
        },

        makeThemeReadyDocument: function (frontColor, allbg, active, hover) {
            var css = "#virtualclassCont.congrea #DocumentShareDashboard #newDocBtn " +
                "{color:" + frontColor + "!important; border: 1px solid " + allbg.fcolor + "!important}";
            this.addCss(css);
        },

        addCss: function (css) {
            var head = document.getElementsByTagName('head')[0];
            var s = document.createElement('style');
            s.setAttribute('type', 'text/css');
            if (s.styleSheet) {   // IE
                s.styleSheet.cssText = css;
            } else {                // the world
                s.appendChild(document.createTextNode(css));
            }
            head.appendChild(s);
        },

    };

    window.colorSelector = colorSelector
})(window)













