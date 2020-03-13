(function (window) {
  const fineUploader = (function () {
    return {
      generateModal(type, elemArr) {
        const bsCont = document.getElementById(`${type}PopupCont`);
        elem1Id = 'congreaVideoContBody';
        elem2Id = 'congreaShareVideoUrlCont';
        const modal = document.createElement('div');

        modal.id = `${type}Popup`;
        modal.className = 'modal';
        modal.role = 'dialog';
        modal.style.display = 'none';
        modal.setAttribute('tab-index', '-1');
        modal.setAttribute('area-hidden', 'true');
        bsCont.appendChild(modal);

        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog';
        modal.appendChild(dialog);

        const content = document.createElement('div');
        content.className = 'modal-content';
        content.id = 'videoModalBody';
        dialog.appendChild(content);

        const head = document.createElement('div');
        head.id = 'contHead';
        head.className = 'modal-header';
        content.appendChild(head);

        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'close';
        el.id = 'modalClose';
        el.setAttribute('data-dismiss', 'modal');

        el.innerHTML = '&times';
        head.appendChild(el);

        const divMain = document.createElement('div');
        divMain.id = 'modalcontBody';
        divMain.className = 'modal-body';
        content.appendChild(divMain);

        elemArr.forEach((elemId) => {
          virtualclass.fineUploader.createElems(divMain, elemId);
        });

        const elem = document.createElement('form');
        elem.id = 'form1';
        content.appendChild(elem);


        const footer = document.createElement('div');
        footer.id = 'contFooter';
        footer.className = 'modal-footer';
        content.appendChild(footer);
      },
      createElems(divMain, id) {
        const upload = document.createElement('div');
        upload.id = id;
        upload.className = 'upload';
        divMain.appendChild(upload);
      },


      initModal(type) {
        $(`#${type}Popup`).modal({
          backdrop: 'static',
          keyboard: false,
        });
        $(`#${type}Popup`).modal({
          show: true,
        });

        $(`#${type}Popup`).on('hidden.bs.modal', () => {
          // virtualclass.poll.test(type)
          $(`#${type}Popup`).remove();
        });
      },
      // endpoint: 'https://uploadmedia.congrea.net',
      uploaderFn(obj) {
        const dataObj = {
          element: obj.wrapper,
          template: 'qq-template-gallery',
          debug: false,
          multiple: obj.multiple,
          validation: { allowedExtensions: obj.validation, minSizeLimit: (4 * 1000), sizeLimit: obj.maxSize }, // minimum file should be 4kb limit
          request: {
            // endpoint: 'https://uploadmedia.congrea.net',
            endpoint: virtualclass.api.uploadMedia,
            accessKey: 'AKIAJV7RJOFBDFVY62EQ',
          },

          signature: {
            //   endpoint: 'https://api.congrea.net/t/upload',
            endpoint: virtualclass.api.upload,
            version: 4,
            customHeaders: {
              'x-api-key': wbUser.lkey,
              'x-congrea-authuser': wbUser.auth_user,
              'x-congrea-authpass': wbUser.auth_pass,
              'x-congrea-room': wbUser.room,
            },
          },
          uploadSuccess: {
            // endpoint: 'https://api.congrea.net/t/uploadSuccess',
            endpoint: virtualclass.api.uploadSuccess,
            customHeaders: {
              'x-api-key': wbUser.lkey,
              'x-congrea-authuser': wbUser.auth_user,
              'x-congrea-authpass': wbUser.auth_pass,
              'x-congrea-room': wbUser.room,
            },
          },
          retry: {
            enableAuto: false, // defaults to false
          },
          cors: {
            allowXdr: true,
            expected: true,
            sendCredentials: false,
          },

          objectProperties: {
            key(id) {
              const congreaKey = wbUser.lkey;
              const congreaRoom = wbUser.room;
              virtualclass.gObj.file = {};

              virtualclass.gObj.file.uuid = this.getUuid(id);
              virtualclass.gObj.file.name = this.getName(id);

              const file = {
                name: this.getName(id),
                uuid: this.getUuid(id),
              };

              virtualclass.gObj.uploadingFiles.push(file);

              virtualclass.gObj.sessionInfo = {
                key: congreaKey,
                room: congreaRoom,
              };

              return `${congreaKey}/${congreaRoom}/${virtualclass.gObj.file.uuid}/${this.getName(id)}`;

              // return congreaKey + '/' + congreaRoom + '/' +  virtualclass.gObj.file.uuid + '/' + this.getName(id);
            },
          },

          callbacks: {
            onComplete(id, xhr, rawData) {
              let ul;
              let dashboard;
              if (obj.cthis === 'video') {
                obj.cb.call(virtualclass.videoUl, id, xhr, rawData);
                const msz = document.querySelector('#videoPopup .qq-upload-list-selector.qq-upload-list');
                if (msz) {
                  msz.style.display = 'none';
                }
                virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                virtualclass.vutil.makeElementActive('#listvideo');

                ul = document.querySelector('#uploadMsz .qq-upload-list-selector.qq-upload-list');
                if (ul != null) {
                  ul.style.display = 'block';
                }
                const lists = document.querySelectorAll('#uploadMsz .qq-upload-list-selector.qq-upload-list');
                if (lists.length > 1) {
                  for (let i = 1; i < lists.length - 1; i++) {
                    lists[i].parentNode.removeChild(lists[i]);
                  }
                }
                virtualclass.vutil.removeChildrens('#VideoDashboard #uploadMsz .qq-upload-list-selector.qq-upload-list li');
                dashboard = document.querySelector('#VideoDashboard');
              } else if (obj.cthis === 'docs') {
                obj.cb.call(virtualclass.dts, id, xhr, rawData);

                virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                virtualclass.vutil.makeElementActive('#listdocs');

                ul = document.querySelector('#docsuploadContainer #docsUploadMsz .qq-upload-list-selector.qq-upload-list');
                if (ul != null) {
                  ul.style.display = 'block';
                }

                virtualclass.vutil.removeChildrens('#docsUploadMsz .qq-upload-list-selector.qq-upload-list li');
                dashboard = document.querySelector('#DocumentShareDashboard');
              }
              if (dashboard != null) {
                dashboard.classList.remove('uploading');
              }
            },

            onError() {
              let msz;
              const alertMsz = document.querySelector('.dbContainer .alert');
              if (alertMsz) {
                alertMsz.parentNode.removeChild(alertMsz);
              }

              if (obj.cthis === 'video') {
                msz = document.querySelector('#videoPopup .qq-upload-list-selector.qq-upload-list');
                if (msz) {
                  msz.style.display = 'none';
                }
                virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                virtualclass.vutil.makeElementActive('#listvideo');
              } else if (obj.cthis === 'docs') {
                msz = document.querySelector('#DocumentShareDashboard .qq-upload-list-selector.qq-upload-list');
                if (msz) {
                  msz.style.display = 'none';
                }
                virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                virtualclass.vutil.makeElementActive('#listdocs');
              }
            },

            onSubmitted(id, name) {
              let container;
              let selector;
              this.setName(id, name.toLowerCase());

              /** It handles the rendering the progressbar after done once * */

              if (obj.cthis === 'video') {
                container = '#uploadMsz';
                selector = '#VideoDashboard';
              } else if (obj.cthis === 'docs') {
                container = '#docsUploadMsz';
                selector = '#DocumentShareDashboard';
              }

              const dashboard = document.querySelector(selector);
              dashboard.classList.add('uploading');

              const msgclose = document.querySelector(`${container} .close`);
              if (msgclose != null) {
                msgclose.click();
              }
              const uploadmsg = document.querySelector(container);
              if (uploadmsg != null) {
                uploadmsg.style.display = 'block';
              }

              const ul = document.querySelector(`${container} .qq-upload-list-selector.qq-upload-list`);
              ul.style.display = 'block';
            },
          },
        };

        // if(Object.prototype.hasOwnProperty.call(obj, 'multiple')){
        //     dataObj.multiple = obj.multiple;
        // }

        // if(Object.prototype.hasOwnProperty.call(obj, 'validation')){
        //     dataObj.allowedExtensions = obj.validation;
        // }

        const galleryUploader = new qq.s3.FineUploader(dataObj);
      },

      onDragEnter(e) {
        let tobeDeactive;
        if (virtualclass.currApp === 'DocumentShare') {
          tobeDeactive = '#listnotes';
          virtualclass.vutil.makeElementDeactive(tobeDeactive);
          virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
        } else if (virtualclass.currApp === 'Video') {
          tobeDeactive = '#listvideo';
          virtualclass.vutil.makeElementDeactive(tobeDeactive);
          virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
        }
      },
      onDragEnd(e) {


      },


    };
  }());
  window.fineUploader = fineUploader;
}(window));
