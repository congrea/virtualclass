(function (window) {
  const colorSelector = {
    // to be made dynamic
    makeThemeReady() {
      const color = virtualclassSetting.theme.selectedColor;
      const brightness = virtualclass.vutil.calcBrightness(color);
      let iconColor;
      if (brightness > 125) {
        iconColor = 'black';
      } else {
        iconColor = 'white';
      }

      const allbg = {};
      const active = {};
      const hover = {};


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
      } else if (brightness > 180) {
        active.fcolor = chroma(color).darken(1.5).hex();
        active.scolor = chroma(color).darken(1.1).hex();

        hover.fcolor = chroma(color).darken(0.5).hex();
        hover.scolor = chroma(color).darken(0.8).hex();
      } else {
        active.fcolor = chroma(color).darken(0.8).hex();
        active.scolor = chroma(color).darken(0.6).hex();

        hover.fcolor = chroma(color).brighten().hex();
        hover.scolor = chroma(color).brighten(1.8).hex();
      }

      allbg.fcolor = color;
      allbg.scolor = chroma(color).brighten().hex();

      const frontColor = iconColor;
      active.frontColor = iconColor;
      hover.frontColor = iconColor;

      this.makeThemeReadyMainCont(frontColor, allbg, active, hover);
      this.makeThemeReadyEditor(frontColor, allbg, active, hover);
      this.makeThemeReadyRightPanel(frontColor, allbg, active, hover);
      this.makeThemeReadyVideo(frontColor, allbg, active, hover, brightness);
      this.makeThemeReadyPoll(frontColor, allbg, active, hover, brightness);
      this.makeThemeReadyPresentation(frontColor, allbg, active, hover, brightness);
      this.makeThemeReadyDocument(frontColor, allbg, active, hover);

      this.lightColorCustomize(frontColor, allbg, active, hover, brightness);
    },

    lightColorCustomize(frontColor, allbg, active, hover, brightness) {
      if (brightness >= 218) {
        allbg.fcolor = chroma(allbg.fcolor).darken(0.4).hex();
        allbg.scolor = chroma(allbg.fcolor).darken().hex();
      }

      const border = `0.05em solid ${allbg.fcolor}`;
      const css = `${'#virtualclassCont.congrea #virtualclassOptionsCont .appOptions '
        + '{border-top:'}${border} !important;}`
        + '#virtualclassCont.congrea #fullScreenButton ,'
        + '#virtualclassCont.congrea .vmchat_bar_button ,'
        + '#virtualclassCont.congrea .vmchat_room_bt.congtooltip ,'
        + '#virtualclassCont.congrea #congAskQuestion ,'
        + '#virtualclassCont.congrea .shapesToolbox ,'
        + '#virtualclassCont.congrea li#appSettingCtrl ,'
        + '#virtualclassCont.congrea #fullScreenExitButton, '
        + '#virtualclassCont.congrea #virtualclassAppRightPanel #askQuestionHeader .header .action, '
        + '#virtualclassCont #virtualclassAppFooterPanel #precheckBtn, '
        + '#virtualclassCont.congrea li#virtualclassnote, '
        + '#virtualclassCont.congrea #virtualclassAppRightPanel #appSettingCtrl, '
        + '#virtualclassCont.congrea #bookmark '
        + `{border-left: 0.01em solid ${allbg.fcolor}!important;}`
        + '#virtualclassCont.congrea #virtualclassAppFooterPanel #chatWidget .chatBarTab '
        + `{border-left:${border} !important;}`
        + '#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool a ,'
        + '#virtualclassCont.congrea .shapesToolbox ,'
        + '#virtualclassCont.congrea #virtualclassAppFooterPanel #chatWidget .chatBarTab li ,'
        + '#virtualclassCont.congrea #fullScreenButton ,'
        + '#virtualclassCont.congrea #fullScreenExitButton, '
        + '#virtualclassCont.congrea.playMode #fullScreenButton ,'
        + '#virtualclassCont #virtualclassAppFooterPanel #precheckBtn, '
        + '#virtualclassCont #virtualclassAppFooterPanel #recording, '
        + '#virtualclassCont.congrea.playMode #fullScreenExitButton '
        + `{border-right: 0.01em solid ${allbg.fcolor}!important;}`
        + '#virtualclassCont.congrea .ui-widget-header.ui-corner-top.ui-chatbox-titlebar.ui-dialog-header'
        + `{border: 0.02em solid ${allbg.fcolor}!important;}`
        + '#virtualclassCont.congrea .btn.btn-default ,'
        + '#virtualclassCont.congrea .vceditor-toolbar, '
        + '#virtualclassCont.congrea #virtualclassAppFooterPanel #chatWidget .chatBarTab,'
        + '#virtualclassCont.congrea #stickybar .footerCtr .vmchat_search #congreaUserSearch ,'
        + '#virtualclassCont.congrea button ,'
        // "#virtualclassCont.congrea .btn.btn-default ,"+
        + '#virtualclassCont.congrea .zoomControler ,'
        + '#virtualclassCont.congrea .btn-default, '
        + '#virtualclassCont.congrea #popupContainer #about-modal #infoMessage #infoMessageOk '
        + `{background-image: linear-gradient(to bottom, ${allbg.fcolor} 0%,${allbg.scolor} 100%) !important;}`;

      this.addCss(css);
    },

    // front color to be calculated
    calcBrightness(color) {
      const rgb = chroma(color).rgb();
      const c = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      const brightness = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
      // console.log(`brightne${brightness}`);
      // alert(brightness);
      return brightness;
    },

    makeThemeReadyMainCont(frontColor, allbg, active, hover) {
      const css = `${'#virtualclassCont.congrea .ui-widget-header, '
        + '#virtualclassCont.congrea .commandToolsWrapper, '
        + '#virtualclassCont.congrea .shapesToolbox .shapesTool, '
        + '#virtualclassCont.congrea #virtualclassAppFooterPanel '
        + '{background-image: linear-gradient(to bottom, '}${allbg.fcolor} 0%,${allbg.scolor} 100%) !important} `

        + '#virtualclassCont.congrea #virtualclassAppLeftPanel #dashboardnav .btn '
        + `{background-image: linear-gradient(to bottom, ${allbg.fcolor} 0%,${allbg.scolor} 100%) !important} `

        + '#virtualclassCont.congrea #virtualclassAppLeftPanel #dashboardnav .btn.clicked'
        + `{background-image: linear-gradient(to bottom, ${active.fcolor} 0%,${active.scolor} 100%) !important} `

        // + '#virtualclassCont.congrea #navigator, '
        + '#virtualclassCont.congrea #sessionEndMsgCont .endHeader,'
        // + '#virtualclassCont.congrea #virtualclassAppContainer .virtualclass .commandToolsWrapper .tool ul.strkSizeList li.selected,'
        // + '#virtualclassCont.congrea #virtualclassAppContainer .virtualclass .commandToolsWrapper .tool ul.fontSizeList span.selected,'
        + '#virtualclassCont.congrea #playButton,'
        + '#virtualclassCont.congrea #recordPlay .rv-vanilla-modal-body #downloadPcCont #downloadSessionText'
        + `{background-image: linear-gradient(to bottom, ${allbg.fcolor} 0%,${allbg.scolor} 100%) !important} `


        + '#virtualclassCont.congrea #virtualclassOptionsCont:first-child '
        + `{background-image: linear-gradient(to right, ${allbg.fcolor} 0%,${allbg.scolor} 100%)} `

        + '#virtualclassCont.congrea #virtualclassOptionsCont .appOptions.active, '
        + '#virtualclassCont.congrea .commandToolsWrapper .tool.active a '
        + `{background-image: radial-gradient(ellipse at center, ${active.fcolor} 0%,${active.scolor} 100%);} `
        + '#virtualclassCont.congrea .tool.active a span:before '
        + `{color:${frontColor}!important}`
        + '#virtualclassCont.congrea #virtualclassOptionsCont .appOptions:hover, '
        + '#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool a:hover, '
        + '#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool ul.fontSizeList span:hover, '
        + '#virtualclassCont.congrea.orginalTeacher #virtualclassAppContainer .virtualclass .commandToolsWrapper .tool[data-tool="stroke"] ul.strkSizeList li:hover, '
        + '#virtualclassCont.congrea #dashboardContainer .modal-header button.enable:hover, '
        + '#virtualclassCont.congrea #confirmCancel #confirmCancelButton:hover, '
        + '#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton:hover, '
        + '#virtualclassCont.congrea #popupContainer #about-modal #infoMessage #infoMessageOk:hover '
        + `{background-image: radial-gradient(ellipse at center, ${hover.fcolor} 0%,${hover.scolor} 100%) !important}`

        + '#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton,'
        + '#virtualclassCont.congrea #confirm.popupWindow #confirmCancel #confirmCancelButton'
        + `{color:${frontColor}!important}`

        + '#virtualclassCont.congrea .appOptions:hover .cgIcon:before'
        + `{color:${hover.frontColor}!important}`

        + '#virtualclassCont.congrea .active .cgIcon:before'
        + `{color:${active.frontColor}!important}`

        // + '#virtualclassCont.congrea .commandToolsWrapper .tool:hover .cgIcon:before'
        // + `{color:${hover.frontColor}!important}`

        + '#virtualclassCont.congrea .cgIcon:before'
        + `{color:${frontColor}!important}`

        + '#virtualclassCont.congrea #docShareNav .pageNav'
        + `{color:${frontColor}!important}`

        + '#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool a'
        + `{color:${frontColor}!important}`

        + '#virtualclassCont.congrea .shapesToolbox a'
        + `{color:${frontColor}!important}`


        + '#virtualclassCont.congrea .cgText'
        + `{color:${frontColor}!important}`

        + '#virtualclassCont.congrea .vchead'
        + `{color:${frontColor}!important}`

        + '#virtualclassCont.congrea .icon-publish2:before'
        + `{color:${active.fcolor}!important}`

        + '#virtualclassCont.congrea button ,'
        + '#virtualclassCont.congrea .btn-default '
        + `{background-image: linear-gradient(to bottom, ${allbg.fcolor} 0%,${allbg.scolor} 100%) !important } `

        + '#virtualclassCont.congrea #congdashboard .modal-header .close'
        + '{opacity :1;}'

        + '#virtualclassCont.congrea .modal-header .btn-default ,'
        + '#virtualclassCont.congrea .modal .btn-default ,'
        + '#virtualclassCont.congrea .precheck .btn-default '
        + `{color :${frontColor}!important} `

        + '#virtualclassCont.congrea .vjs-control-bar .vjs-autoPlay-button '
        + '{background:none !important ;}'
        + '#virtualclassCont.congrea .vjs-control-bar .vjs-button '
        + '{background:none !important ; border:none !important ;color:white!important}'

        + '#virtualclassCont.congrea  #onlineusertext:before'
        + `{color :${frontColor}!important} `

        + '#virtualclassCont.congrea  #recordPlay #playButton:before'
        + `{color :${frontColor}!important} `

        + '#virtualclassCont.congrea #recordingHeaderContainer  '
        + `{background-image: linear-gradient(to bottom, ${allbg.fcolor} 0%,${allbg.scolor} 100%) !important ;color:${frontColor}!important} `
        + '#virtualclassCont.congrea  #virtualclassApp .playControllerMainCont '
        + `{background-image: linear-gradient(to bottom, ${allbg.fcolor} 0%,${allbg.scolor} 100%) !important ;color:${frontColor}!important} `

        + '#virtualclassCont.congrea  .dbContainer .qq-cancel-button-selector'
        + `{color :${frontColor}!important} `
        + ' #virtualclassCont.congrea #virtualclassOptionsCont .appOptions '
        + `{border : 1px solid${allbg.fcolor}!important} `
        + `{background-image: linear-gradient(to bottom, ${active.fcolor} 0%,${active.scolor} 100%) !important ;color:${frontColor}!important} `
        + `{border-left: 1px solid ${allbg.fcolor}!important}`
        + '#virtualclassCont.congrea  #playController button'
        + `{background-image:none !important;color:${frontColor}!important; border-right: 1px solid ${allbg.fcolor}!important}`
        + '#virtualclassCont.congrea #virtualclassAppLeftPanel .containerWb .commandToolsWrapper .shapesToolbox.active'
        + `{background-image: radial-gradient(ellipse at center, ${active.fcolor} 0%,${active.scolor} 100%);} `;
      this.addCss(css);
    },


    makeThemeReadyEditor(frontColor, allbg, active, hover) {
      const css = `${'#virtualclassCont.congrea a.vceditor-btn'
        + '#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool ul.fontSizeList span.selected,'
        + '{background-color: '}${active.fcolor}} `

        + '#virtualclassCont.congrea a.vceditor-btn'
        + `{color: ${active.frontColor}} `

        + '#virtualclassCont.congrea #alleditorRichContainer'
        + `{background-color: ${active.frontColor}} `

        + '#virtualclassCont.congrea .commandToolsWrapper .tool.active a'
        + `{background-image: radial-gradient(ellipse at center, ${active.fcolor} 0%,${active.scolor} 100% !important)} `
        + '#virtualclassCont .vceditor-dropdown-menu a:hover'
        + `{background-color:${allbg.fcolor}!important}`;

      this.addCss(css);
    },


    makeThemeReadyRightPanel(frontColor, allbg, active, hover) {
      const css = `${'#virtualclassCont.congrea #recordPlay .rv-vanilla-modal-body #downloadPcCont #downloadSessionText,'
        + '#virtualclassCont.congrea #virtualclassAppRightPanel #audioWidget'
        + '{background-image: linear-gradient(to bottom, '}${allbg.fcolor} 0%,${allbg.scolor} 100%) !important}`

        + '#virtualclassCont.congrea #stickycontainer .inner_bt:hover, '
        // + '#virtualclassCont.congrea #audioWidget a#rightCtlr:hover, '
        + '#virtualclassCont.congrea a.stdAskQuestion:hover, '
        + '#virtualclassCont.congrea li#appSettingCtrl a#appSettingCtrlAnchor:hover ,'
        + '#virtualclassCont.congrea #stickycontainer .stdAskQuestion #iconAskQuestion:hover, '
        + '#virtualclassCont.congrea #stickycontainer #contrAudioAll:hover, '
        + '#virtualclassCont.congrea #virtualclassAppRightPanel #mainAudioPanel li:hover, '
        + '#virtualclassCont.congrea #virtualclassAppRightPanel #mainAudioPanel li a:hover,'
        // + '#virtualclassCont.congrea #audioWidget #speakerPressOnce:hover,'
        + '#virtualclassCont.congrea #audioTest-box:hover,'
        + '#virtualclassCont.congrea #playButton:hover, '
        + '#virtualclassCont.congrea #alwaysPress:hover,'
        + '#virtualclassCont.congrea .recButton:hover,'
        + '#virtualclassCont.congrea li#virtualclassnote a:hover , '
        + '#virtualclassCont.congrea #virtualclassAppRightPanel #appSettingCtrl:hover, '
        + '#virtualclassCont #virtualclassAppFooterPanel #precheckBtn:hover, '
        + '#virtualclassCont #virtualclassAppFooterPanel #recording.show:hover, '
        + '#virtualclassCont.congrea #virtualclassAppFooterPanel #bookmark:hover, '
        + '#virtualclassCont.congrea #virtualclassAppFooterPanel #fullScreenExitButton:hover, '
        + '#virtualclassCont.congrea #virtualclassAppFooterPanel #fullScreenButton:hover, '
        + '#virtualclassCont.congrea #virtualclassAppRightPanel #askQuestionHeader .header .action .addQuestion-icon:hover '
        + `{background-image: radial-gradient(ellipse at center, ${hover.fcolor} 0%,${hover.scolor} 100%) !important}`

        + '#virtualclassCont.congrea .vmchat_support.active ,'
        + '#virtualclassCont.congrea .vmchat_room_bt.active,'
        + '#virtualclassCont.congrea .vmchat_bar_button.active, '
        + '#virtualclassCont.congrea li#appSettingCtrl.active, '
        + '#virtualclassCont.congrea #virtualclassAppRightPanel #audioWidget .settingActive,'
        + '#virtualclassCont.congrea #virtualclassAppRightPanel #stickycontainer .askQuestion_btn.disable'
        + `{background-image: radial-gradient(ellipse at center, ${active.fcolor} 0%,${active.scolor} 100%) !important}`

        + '#virtualclassCont.congrea #virtualclassAppRightPanel li:hover .cgIcon:before'
        + `{color:${hover.frontColor}!important}`

        + '#virtualclassCont.congrea #virtualclassAppRightPanel #appSettingCtrlAnchor span'
        + `{color:${frontColor}!important}`

        + '#virtualclassCont.congrea #virtualclassAppRightPanel li:hover .cgText'
        + `{color:${hover.frontColor}!important}`

        + '#virtualclassCont.congrea #virtualclassAppRightPanel .askQuestion_btn.enable #iconAskQuestion:before'
        + `{color:${frontColor}!important}`

        + '#virtualclassCont.congrea #virtualclassAppRightPanel .pre-check-btn'
        + `{background-image: linear-gradient(to bottom, ${allbg.fcolor} 0%,${allbg.scolor} 100%) !important ;color:${frontColor}!important} `;
      this.addCss(css);
    },

    makeThemeReadyVideo(frontColor, allbg, active, hover, brightness) {
      let iconColor = allbg.fcolor;
      if (brightness > 180) {
        iconColor = active.fcolor;
      }

      const css = `${'#virtualclassCont.congrea .ui-widget-header,'
        + '#virtualclassCont.congrea #congdashboard .modal-header,'
        + '#virtualclassCont #virtualclassApp #virtualclassAppLeftPanel #sidebarButton, '
        + '#virtualclassCont.congrea #layoutPoll #navigator, '
        + '#virtualclassCont.congrea #layoutQuiz .navbar, '
        + '#virtualclassCont.congrea #virtualclassAppFooterPanel #audioWidget '
        + '{background-image: linear-gradient(to bottom, '}${allbg.fcolor} 0%,${allbg.scolor} 100%) !important}`
        + '#virtualclassCont.congrea #listvideo .linkvideo .videoTitleCont:before, '
        + '#virtualclassCont.congrea #listvideo .linkvideo .controls .editanch:before, '
        + `#virtualclassCont.congrea #listvideo .linkvideo .controls:before{color:${iconColor}!important}`
        + `#virtualclassCont.congrea #listvideo .linkvideo .controls:hover:before{color:${hover.fcolor}!important}`
        + `#virtualclassCont.congrea #VideoDashboard button{color:${frontColor}!important}`
        + `#virtualclassCont.congrea #VideoDashboard button{border:1px solid${frontColor}!important}`
        + `{background-color: ${active.frontColor}!important} `
        + `#virtualclassCont.congrea #listvideo .linkvideo.playing{border:solid ${allbg.fcolor} 1px!important}`;
      this.addCss(css);
    },

    makeThemeReadyPoll(frontColor, allbg, active, hover, brightness) {
      let iconColor = allbg.fcolor;
      if (brightness > 180) {
        iconColor = active.fcolor;
      }

      const css = `${'#virtualclassCont.congrea #virtualclassPoll .btn.btn-default, '

        + '#virtualclassCont.congrea #virtualclassPoll #stdPollContainer #btnVote'
        + '{color:'}${frontColor};}`
        + `#virtualclassCont.congrea .bootstrap .pollNavBar > li > a {color:${frontColor} ; }`
        + '#virtualclassCont.congrea .bootstrap .navListTab:hover'
        + `{color:${hover.frontColor}!important;}`
        + '#virtualclassCont.congrea #virtualclassPoll #chartMenuCont a, '
        + '#virtualclassCont.congrea #virtualclassPoll .controlIcon:before'
        + `{color:${iconColor}!important}`
        + `#virtualclassCont.congrea #virtualclassPoll .controlIcon:hover:before{color:${hover.fcolor}!important}`
        // + '#virtualclassCont.congrea #virtualclassPoll #navigator #stdPollHeader'
        // + `{color:${frontColor}!important;}`
        + '#virtualclassCont.congrea #virtualclassPoll .modal button.close ,'
        + '#virtualclassCont.congrea  .alert .close '
        + '{background-image: none !important ;background-color:none !important}';

      this.addCss(css);
    },
    makeThemeReadyPresentation(frontColor, allbg, active, hover, brightness) {
      let iconColor = allbg.fcolor;
      // if(brightness >180){
      if (brightness > 180) {
        iconColor = active.fcolor;
        hover.fcolor = chroma(active.fcolor).darken();
      }


      const css = `${'#virtualclassCont.congrea #SharePresentationDashboard .btn-default'
        + '{color:'}${frontColor}!important;}`
        + '#virtualclassCont.congrea #virtualclassPoll #chartMenuCont a, '
        + `#virtualclassCont.congrea #SharePresentationDashboard .controls:before{color:${iconColor}!important}`
        + `#virtualclassCont.congrea #SharePresentationDashboard .controls:hover:before{color:${hover.fcolor}!important}`;
      this.addCss(css);
    },

    makeThemeReadyDocument(frontColor, allbg, active, hover) {
      const css = `${'#virtualclassCont.congrea #DocumentShareDashboard #newDocBtn '
        + '{color:'}${frontColor}!important; border: 1px solid ${allbg.fcolor}!important}`;
      this.addCss(css);
    },

    addCss(css) {
      const head = document.getElementsByTagName('head')[0];
      const s = document.createElement('style');
      s.setAttribute('type', 'text/css');
      if (s.styleSheet) { // IE
        s.styleSheet.cssText = css;
      } else { // the world
        s.appendChild(document.createTextNode(css));
      }
      head.appendChild(s);
    },

  };

  window.colorSelector = colorSelector;
}(window));
