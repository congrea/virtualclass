(function (window, document) {
  // This file is part of Vidyamantra - http:www.vidyamantra.com/
  /** @Copyright 2018  Vidya Mantra EduSystems Pvt. Ltd.
   * @author  Nirmala Mehta <http://www.vidyamantra.com>
   * This file is to add  raise hand feature .
   * student can raise hand if they have queries
   */

  const raiseHand = function (config) {
    return {
      stdRhEnable: 'enabled',
      rhCount: 0,
      rhCountR: 0,
      init(obj) {
        this.stdRhEnable = 'enabled';
        if (!roles.hasControls()) {
          this.attachHandlerAtStudent();
          // this.stdRhEnable=localStorage.getItem("stdRhEnable");
          if (this.stdRhEnable && this.stdRhEnable === 'disabled') {
            const rhElem = document.querySelector('#virtualclassCont.congrea #icHr');
            rhElem.setAttribute('data-action', 'disable');
            const cont = document.querySelector('#virtualclassCont.congrea #congHr');
            cont.classList.remove('enable');
            cont.classList.add('disable');
            cont.setAttribute('data-title', virtualclass.lang.getString('RaiseHandStdDisabled'));
            // localStorage.removeItem("stdRhEnable");
          }
        }
      },

      raisehand(userid) {
        // var controlContainer = document.getElementById(userid + 'contRaiseH');
        var controlContainer = chatContainerEvent.elementFromShadowDom(`#ml${userid} .controllerRaiseH`);
        const anch = controlContainer.querySelector('a.congtooltip');
        const cont = anch.querySelector('.RaiseHandImg');
        ioAdapter.mustSendUser({
          data: {
            action: 'disable',
          },
          cf: 'raiseHand',
        }, userid);
        controlContainer.classList.remove('enabled');
        controlContainer.classList.add('disabled');
        cont.setAttribute('data-raisehand-disable', true);
        anch.setAttribute('data-title', 'disabled');
        controlContainer.style.pointerEvents = 'none';
        virtualclass.user.control.updateUser(userid, 'raiseHand', false);
        virtualclass.raiseHand.moveDownInList(userid);
        this.rhCount--;
        if (!this.rhCount) {
          document.querySelector('#user_list .hand_bt').classList.remove('highlight');
        }

        const text = document.querySelector('#user_list .hand_bt  #notifyText');
        if (this.rhCount > 0) {
          text.innerHTML = this.rhCount;
        } else {
          const rh = document.querySelector('#user_list .hand_bt');
          text.innerHTML = '';
          rh.classList.remove('congtooltip');
          rh.removeAttribute('data-title');
          document.querySelector('#user_list .hand_bt').classList.remove('highlight');
        }
      },

      onMsgRec(e) {
        const rMsg = e.message;
        if (roles.hasControls()) {
          this.msgRecAtTeacher(rMsg.data);
        } else {
          this.msgRecAtStudent(rMsg.data);
        }
      },
      msgRecAtTeacher(msg) {
        // console.log(`raiseStd${msg.action}`);
        const userid = msg.user;

        // var controlContainer = document.getElementById(userid+ 'contRaiseH');
        // var anch = document.getElementById(userid + 'contRaiseAnch');
        // var cont = document.getElementById(userid + 'contrRaiseHandImg');
        const controlContainer = chatContainerEvent.elementFromShadowDom(`#ml${userid} .controllerRaiseH`);
        const anch = controlContainer.querySelector('a.congtooltip');
        const cont = anch.querySelector('.RaiseHandImg');


        if (msg.action === 'enable') {
          this.enableRaiseHand(userid);
          this.moveUpInList();
        } else if (msg.action === 'disable') {
          virtualclass.user.control.updateUser(userid, 'raiseHand', false);
          controlContainer.classList.remove('enabled');
          controlContainer.classList.add('disabled');
          cont.setAttribute('data-raisehand-disable', true);
          anch.setAttribute('data-title', 'disabled');
          controlContainer.style.pointerEvents = 'none';
          this.moveDownInList(userid);
          this.rhCount--;
          if (!this.rhCount) {
            document.querySelector('#user_list .hand_bt').classList.remove('highlight');
          }
        }
        const text = document.querySelector('#user_list .hand_bt  #notifyText');
        if (this.rhCount > 0) {
          text.innerHTML = this.rhCount;
        } else {
          const rh = document.querySelector('#user_list .hand_bt');
          text.innerHTML = '';
          rh.classList.remove('congtooltip');
          rh.removeAttribute('data-title');
        }
      },

      msgRecAtStudent(msg) {
        if (msg.action === 'disable') {
          this.stdRhEnable = 'enabled';
          const stdR = document.getElementById('congHr');
          stdR.classList.remove('disable');
          stdR.classList.add('enable');
          const rhElem = document.querySelector('#virtualclassCont.congrea #icHr');
          // rhElem.setAttribute("data-title",virtualclass.lang.getString("RaiseHandStdEnabled"));
          rhElem.setAttribute('data-action', 'enable');

          const handCont = document.querySelector('#virtualclassCont.congrea #congHr');
          handCont.setAttribute('data-title', virtualclass.lang.getString('RaiseHandStdEnabled'));
        }
      },
      moveUpInList() {
        const ctrEn = chatContainerEvent.elementFromShadowDom('.controllerRaiseH', 'all');
        const membList = '.ui-memblist-usr';
        for (let i = 0; i < ctrEn.length; i++) {
          if (ctrEn[i].classList.contains('enabled')) {
            if (i !== 0) {
              // to simplify
              ctrEn[i].closest(membList).parentNode.insertBefore(ctrEn[i].closest(membList), ctrEn[0].closest(membList));
            }
          }
        }
      },
      moveDownInList(userid) {
        // var ctrEn = document.querySelectorAll("#virtualclassCont.congrea .controllerRaiseH.enabled")
        const ctrEn = chatContainerEvent.elementFromShadowDom('.controllerRaiseH.enabled', 'all');
        const userLink = virtualclass.gObj.testChatDiv.shadowRoot.getElementById(`${userid}contRaiseH`);
        const membList = '.ui-memblist-usr';
        if (ctrEn.length > 0) {
          userLink.closest(membList).parentNode.insertBefore(userLink.closest(membList), ctrEn[ctrEn.length - 1].closest(membList).nextSibling);
        }
      },

      // to verify
      enableRaiseHand(userid) {
        this.rhCount++;
        this._enableRaiseHand(this.rhCount, userid);
      },

      _enableRaiseHand(count, userid) {
        // var controlContainer = document.getElementById(userid + 'contRaiseH');
        // var anch = document.getElementById(userid + 'contRaiseAnch');
        // var cont = document.getElementById(userid + 'contrRaiseHandImg');

        const controlContainer = chatContainerEvent.elementFromShadowDom(`#ml${userid} .controllerRaiseH`);
        const anch = controlContainer.querySelector('a.congtooltip');
        const cont = anch.querySelector('.RaiseHandImg');


        virtualclass.user.control.updateUser(userid, 'raiseHand', true);
        controlContainer.classList.remove('disabled');
        controlContainer.classList.add('enabled');
        cont.setAttribute('data-raisehand-disable', false);
        anch.setAttribute('data-title', virtualclass.lang.getString('RaiseHandEnable'));
        controlContainer.style.pointerEvents = 'visible';
        // count++;

        const handbt = document.querySelector('#user_list .hand_bt');
        if (!handbt.classList.contains('highlight')) {
          handbt.classList.add('highlight');
        }

        const text = document.querySelector('#user_list .hand_bt  #notifyText');
        text.innerHTML = count;
        const tooltip = document.querySelector('#user_list .hand_bt');
        if (!tooltip.classList.contains('congtooltip')) {
          tooltip.classList.add('congtooltip');
        }
        tooltip.setAttribute('data-title', virtualclass.lang.getString('raiseHandNotify'));
      },
      _raiseHand(userid) {
        this.rhCountR++;
        this.rhCount = this.rhCountR;
        this._enableRaiseHand(this.rhCountR, userid);
      },

      updateInStorage() {
        // localStorage.setItem('stdRhEnable', this.stdRhEnable);
      },

      attachHandlerAtStudent() {
        // const cont = document.querySelector('#virtualclassCont.congrea #congHr');
        // cont.addEventListener('click', () => {
        //   const rhElem = document.querySelector('#virtualclassCont.congrea #icHr');
        //   const toUser = virtualclass.vutil.whoIsTeacher();
        //   ioAdapter.mustSendUser({
        //     data: {
        //       user: wbUser.id,
        //       action: rhElem.getAttribute('data-action'),
        //     },
        //     cf: 'raiseHand',
        //   }, toUser);
        //
        //   if (rhElem.getAttribute('data-action') === 'enable') {
        //     rhElem.setAttribute('data-action', 'disable');
        //     cont.classList.remove('enable');
        //     cont.classList.add('disable');
        //     var handCont = document.querySelector('#virtualclassCont.congrea #congHr');
        //     handCont.setAttribute('data-title', virtualclass.lang.getString('RaiseHandStdDisabled'));
        //     virtualclass.raiseHand.stdRhEnable = 'disabled';
        //   } else {
        //     rhElem.setAttribute('data-action', 'enable');
        //     cont.classList.add('enable');
        //     cont.classList.remove('disable');
        //     var handCont = document.querySelector('#virtualclassCont.congrea #congHr');
        //     handCont.setAttribute('data-title', virtualclass.lang.getString('RaiseHandStdEnabled'));
        //     virtualclass.raiseHand.stdRhEnable = 'enabled';
        //   }
        // });
        virtualclass.settings.raisehand(false);
      },

    };
  };
  window.raiseHand = raiseHand();
}(window, document));
