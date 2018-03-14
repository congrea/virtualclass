(function(window){
var colorSelector ={
    // to be made dynamic
    makeThemeReady:function(color){
        //color="#333636";
        color="#143D39";
        // color="pink";
        // color="green";
        // color ="#B1B83D";
        // color ="#4778C2";
        // color ="#C2476A";
        // color ="#F2D9F2";
        // color= "#473295";
        // color ="#71D089";
        // color ="#0E2A16";
        // color ="#6F2569";
        // color ="#CBE7B6";
        // color ="#140F2E";
        // color ="#F2FAF0";
        // color ="#9FDFC1";
        // color ="#CAB3E6";
        // color ="#361B50";
        // color ="black";
        // color ="#1C1F0A";
        // color ="#0B1B09";
        // color ="white";
        // color ="#CDEEDE";
        // color ="#E4F6EE";
        // color ="#D8E3AB";

        var rgb = chroma(color).rgb()
        var c = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';


        var brightness = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);

        console.log(brightness);

        var iconColor;
        if (brightness > 125) {
            iconColor="black"
        } else {
            iconColor="white"

        }

        var allbg={};
        var active={};
        var hover= {};


        hover.fcolor=chroma(color).brighten().hex();
        hover.scolor=chroma(color).brighten(1.8).hex();
        // to be modified
        if(brightness<50){
            if(brightness <=20){
                active.fcolor=chroma(color).brighten(2).hex();
                active.scolor=chroma(color).brighten(3).hex();
            }else{
                active.fcolor=chroma(color).darker().hex();
                active.scolor=chroma(color).darker(2).hex();
            }

        }else{
            if(brightness>180){
                active.fcolor=chroma(color).darker(1.5).hex();
                active.scolor=chroma(color).darker(1.1).hex();

                hover.fcolor=chroma(color).darker(.5).hex();
                hover.scolor=chroma(color).darker(.8).hex();


            }else{
                active.fcolor=chroma(color).darker(.8).hex();
                active.scolor=chroma(color).darker(.6).hex();

                hover.fcolor=chroma(color).brighten().hex();
                hover.scolor=chroma(color).brighten(1.8).hex();
            }

        }

        allbg.fcolor = color;
        allbg.scolor = chroma(color).brighten().hex();


        var frontColor =iconColor;
        active.frontColor=iconColor;
        hover.frontColor=iconColor;

        this.makeThemeReadyMainCont(frontColor,allbg,active,hover);
        this.makeThemeReadyEditor(frontColor,allbg,active,hover)
        this.makeThemeReadyRightPanel(frontColor,allbg,active,hover);
        this.makeThemeReadyVideo(frontColor,allbg,active,hover,brightness);
        this.makeThemeReadyPoll(frontColor,allbg,active,hover,brightness);
        this.makeThemeReadyPresentation(frontColor,allbg,active,hover,brightness);
        this.makeThemeReadyDocument(frontColor,allbg,active,hover);
         },


     // front color to be calculated
    calcThemeColors:function(color){


    },

    makeThemeReadyMainCont : function (frontColor,allbg,active,hover){

        var css= "#virtualclassCont.congrea .ui-widget-header" +
            "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important} "+

            "#virtualclassCont.congrea #virtualclassAppLeftPanel #dashboardnav .btn" +
            "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important} "+

            "#virtualclassCont.congrea #virtualclassAppLeftPanel #dashboardnav .btn.clicked" +
            "{background: linear-gradient(to bottom, "+active.fcolor+" 0%,"+active.scolor+" 100%) !important} "+

            "#virtualclassCont.congrea #virtualclassOptionsCont:first-child, " +
            "#virtualclassOptionsCont, " +
            "#virtualclassCont.congrea #navigator, " +
            "#virtualclassCont.congrea #layoutQuiz .navbar, " +
            "#virtualclassCont.congrea .commandToolsWrapper, " +
            "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton, " +
            "#virtualclassCont.congrea #playButton, " +
            "#virtualclassCont.congrea #confirmCancel #confirmCancelButton," +
            "#virtualclassCont.congrea #recordPlay .rv-vanilla-modal-body #downloadPcCont #downloadSessionText" +
            "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%)} "+

            "#virtualclassCont.congrea .commandToolsWrapper" +
            "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%)} "+
            "#virtualclassCont.congrea #virtualclassOptionsCont .appOptions.active, " +
            "#virtualclassCont.congrea .commandToolsWrapper .tool.active a " +
            "{background: radial-gradient(ellipse at center, "+active.fcolor+" 0%,"+active.scolor+" 100%)} "+

            "#virtualclassCont.congrea #virtualclassOptionsCont .appOptions:hover, " +
            "#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool a:hover, " +
            "#virtualclassCont.congrea #confirmCancel #confirmCancelButton:hover, " +
            "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton:hover" +
            "{background: radial-gradient(ellipse at center, "+hover.fcolor+" 0%,"+hover.scolor+" 100%) !important}"+

            "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton,"+
            "#virtualclassCont.congrea #confirm.popupWindow #confirmCancel #confirmCancelButton"+
            "{color:"+frontColor+"!important}"+

            "#virtualclassCont.congrea .appOptions:hover .cgIcon:before" +
            "{color:"+hover.frontColor +"!important}"+

            "#virtualclassCont.congrea .active .cgIcon:before" +
            "{color:"+active.frontColor +"!important}"+


            "#virtualclassCont.congrea .commandToolsWrapper .tool:hover .cgIcon:before" +
            "{color:"+hover.frontColor +"!important}"+

            "#virtualclassCont.congrea .cgIcon:before" +
            "{color:"+frontColor+"!important}"+

            "#virtualclassCont.congrea .cgText" +
            "{color:"+frontColor+"!important}"+

            "#virtualclassCont.congrea .vchead" +
            "{color:"+frontColor+"!important}"+

            "#virtualclassCont.congrea .icon-publish2:before" +
            "{color:"+active.fcolor+"!important}";

            this.addCss(css);

    },


    makeThemeReadyEditor:function(frontColor,allbg,active,hover){

        var css="#virtualclassCont.congrea a.vceditor-btn" +
            "{background-color: "+active.fcolor+"} " +

            "#virtualclassCont.congrea a.vceditor-btn" +
            "{color: "+active.frontColor+"} " +

            "#virtualclassCont.congrea #alleditorRichContainer" +
            "{background-color: "+active.frontColor+"} " +

            "#virtualclassCont.congrea .vceditor-toolbar" +
            "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important} "+

            "#virtualclassCont.congrea a.vceditor-btn:hover" +
            "{color:"+hover.frontColor +"!important}"+

            "#virtualclassCont.congrea a.vceditor-btn:hover" +
            "{background: radial-gradient(ellipse at center, "+hover.fcolor+" 0%,"+hover.scolor+" 100%) !important}"+

            "#virtualclassCont.congrea .commandToolsWrapper .tool.active a" +
            "{background: radial-gradient(ellipse at center, "+active.fcolor+" 0%,"+active.scolor+" 100% !important)} ";
            this.addCss(css);


    },


    makeThemeReadyRightPanel:function(frontColor,allbg,active,hover)
    {
        var css ="#virtualclassCont.congrea #recordPlay .rv-vanilla-modal-body #downloadPcCont #downloadSessionText," +
            "#virtualclassCont.congrea #virtualclassAppRightPanel #audioWidget" +
            "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%)}"+
            "#virtualclassCont.congrea #chatWidget .chatBarTab"+
            "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%)}"+

            "#virtualclassCont.congrea #stickycontainer .inner_bt:hover, "+
            "#virtualclassCont.congrea #stickycontainer #contrAudioAll:hover, "+
            "#virtualclassCont.congrea #virtualclassAppRightPanel li:hover, "+
            "#virtualclassCont.congrea #virtualclassAppRightPanel li a:hover," +
            "#virtualclassCont.congrea #audioWidget #speakerPressOnce:hover," +
            "#virtualclassCont.congrea #audioTest-box:hover," +
            "#virtualclassCont.congrea #playButton:hover, " +
            "#virtualclassCont.congrea #alwaysPress:hover" +
            "{background: radial-gradient(ellipse at center, "+hover.fcolor+" 0%,"+hover.scolor+" 100%) !important}"+

            "#virtualclassCont.congrea .vmchat_support.active ," +
            "#virtualclassCont.congrea .vmchat_room_bt.active," +
            "#virtualclassCont.congrea .vmchat_bar_button.active "+
            "{background: radial-gradient(ellipse at center, "+active.fcolor+" 0%,"+active.scolor+" 100%)}"+

            "#virtualclassCont.congrea #virtualclassAppRightPanel li:hover .cgIcon:before" +
            "{color:"+hover.frontColor +"!important}"+

            "#virtualclassCont.congrea #virtualclassAppRightPanel li:hover .cgText" +
            "{color:"+hover.frontColor +"!important}";
            this.addCss(css);

    },

    makeThemeReadyVideo:function(frontColor,allbg,active,hover,brightness){
        var iconColor = allbg.fcolor;
        if(brightness >180){
            iconColor = active.fcolor;

        }

        var css="#virtualclassCont.congrea #VideoDashboard #congreaShareVideoUrlCont button{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important} " +
            "#virtualclassCont.congrea .ui-widget-header{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important}"+
            "#virtualclassCont.congrea #listvideo .linkvideo .videoTitleCont:before, " +
            "#virtualclassCont.congrea #listvideo .linkvideo .controls .editanch:before, "+
            "#virtualclassCont.congrea #listvideo .linkvideo .controls:before{color:"+iconColor+"!important}"+
            "#virtualclassCont.congrea #listvideo .linkvideo .controls:hover:before{color:"+hover.fcolor+"!important}"+
            "#virtualclassCont.congrea #VideoDashboard button{color:"+frontColor+"!important}"+
            "#virtualclassCont.congrea #listvideo .linkvideo.playing{border:solid "+allbg.fcolor+" 1px!important}";
        this.addCss(css);
    },

    makeThemeReadyPoll:function(frontColor,allbg,active,hover,brightness){
        var iconColor = allbg.fcolor;
        if(brightness >180){
             iconColor = active.fcolor;

        }

        var css= "#virtualclassCont.congrea #virtualclassPoll .btn.btn-default, "+
            "#virtualclassCont.congrea #virtualclassPoll #resultLayoutHead button, "+
            "#virtualclassCont.congrea #virtualclassPoll #stdPollContainer #btnVote"+
            "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important;color:"+frontColor+";}"+
            "#virtualclassCont.congrea .bootstrap .pollNavBar > li > a {color:"+frontColor+" ; }"+
            "#virtualclassCont.congrea .bootstrap .navListTab:hover"+
            "{background: linear-gradient(to bottom, "+hover.fcolor+" 0%,"+hover.scolor+" 100%) !important;color:"+hover.frontColor+"!important;}"+
            "#virtualclassCont.congrea #virtualclassPoll #chartMenuCont a, "+
            "#virtualclassCont.congrea #virtualclassPoll .controlIcon:before{color:"+iconColor+"!important}" +
            "#virtualclassCont.congrea #virtualclassPoll .controlIcon:hover:before{color:"+hover.fcolor+"!important}" ;

        this.addCss(css);
    },
    makeThemeReadyPresentation:function(frontColor,allbg,active,hover,brightness){
        var iconColor = allbg.fcolor;
        if(brightness >180){
            iconColor = active.fcolor;
            hover.fcolor = chroma(active.fcolor).darker();
        }


        var css= "#virtualclassCont.congrea #SharePresentationDashboard .btn-default"+
            "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important;color:"+frontColor+"!important;}"+
            "#virtualclassCont.congrea #virtualclassPoll #chartMenuCont a, "+
            "#virtualclassCont.congrea #SharePresentationDashboard .controls:before{color:"+iconColor+"!important}" +
            "#virtualclassCont.congrea #SharePresentationDashboard .controls:hover:before{color:"+hover.fcolor+"!important}" ;
        this.addCss(css);
    },

    makeThemeReadyDocument:function(frontColor,allbg,active,hover){
        var css= "#virtualclassCont.congrea #DocumentShareDashboard #newDocBtn, "+
            "#virtualclassCont.congrea #DocumentShareDashboard .linkdocs.links[data-selected='0']"+
            "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important;color:"+frontColor+"!important;}"+
            "#virtualclassCont.congrea #DocumentShareDashboard .linkdocs.links[data-selected='1']"+
            "{background: linear-gradient(to bottom, "+active.fcolor+" 0%,"+active.scolor+" 100%) !important;color:"+active.frontColor+"!important;}";

        this.addCss(css);
    },

    addCss:function(css){
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

window.colorSelector= colorSelector
})(window)













