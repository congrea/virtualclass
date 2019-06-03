(function (window) {
    var fineUploader = function () {
        return {
            generateModal: function (type, elemArr) {
                var bsCont = document.getElementById(type + "PopupCont");
                elem1Id = "congreaVideoContBody";
                elem2Id = "congreaShareVideoUrlCont";
                var modal = document.createElement("div");

                modal.id = type + "Popup";
                modal.className = "modal";
                modal.role = "dialog";
                modal.style.display = "none";
                modal.setAttribute("tab-index", "-1");
                modal.setAttribute("area-hidden", "true");
                bsCont.appendChild(modal);

                var dialog = document.createElement("div");
                dialog.className = "modal-dialog";
                modal.appendChild(dialog);

                var content = document.createElement("div");
                content.className = "modal-content";
                content.id = "videoModalBody"
                dialog.appendChild(content);

                var head = document.createElement("div");
                head.id = "contHead";
                head.className = "modal-header";
                content.appendChild(head);

                var el = document.createElement('button');
                el.type = "button";
                el.className = "close";
                el.id = "modalClose";
                el.setAttribute("data-dismiss", "modal");

                el.innerHTML = "&times";
                head.appendChild(el);

                var divMain = document.createElement("div");
                divMain.id = "modalcontBody";
                divMain.className = "modal-body";
                content.appendChild(divMain);

                elemArr.forEach(function (elemId) {
                    virtualclass.fineUploader.createElems(divMain, elemId);

                });

                var elem = document.createElement("form");
                elem.id = "form1";
                content.appendChild(elem);


                var footer = document.createElement("div");
                footer.id = "contFooter";
                footer.className = "modal-footer";
                content.appendChild(footer);


            },
            createElems: function (divMain, id) {
                var upload = document.createElement("div");
                upload.id = id;
                upload.className = "upload";
                divMain.appendChild(upload);
            },


            initModal: function (type) {

                $('#' + type + 'Popup').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#' + type + 'Popup').modal({
                    show: true
                });

                $('#' + type + 'Popup').on('hidden.bs.modal', function () {
                    //virtualclass.poll.test(type)
                    $('#' + type + 'Popup').remove();
                });
            },
            //endpoint: 'https://uploadmedia.congrea.net',
            uploaderFn: function (obj) {
                var dataObj = {
                    element: obj.wrapper,
                    template: 'qq-template-gallery',
                    debug: true,
                    multiple: obj.multiple,
                    validation: {allowedExtensions: obj.validation, minSizeLimit: (4 * 1000), sizeLimit: obj.maxSize}, // minimum file should be 4kb limit
                    request: {
                        //endpoint: 'https://uploadmedia.congrea.net',
                        endpoint: virtualclass.api.uploadMedia,
                        accessKey: "AKIAJV7RJOFBDFVY62EQ"
                    },

                    signature: {
                        //   endpoint: 'https://api.congrea.net/t/upload',
                        endpoint: virtualclass.api.upload,
                        version: 4,
                        customHeaders: {
                            'x-api-key': wbUser.lkey,
                            'x-congrea-authuser': wbUser.auth_user,
                            'x-congrea-authpass': wbUser.auth_pass,
                            'x-congrea-room': wbUser.room
                        }
                    },
                    uploadSuccess: {
                        //endpoint: 'https://api.congrea.net/t/uploadSuccess',
                        endpoint: virtualclass.api.uploadSuccess,
                        customHeaders: {
                            'x-api-key': wbUser.lkey,
                            'x-congrea-authuser': wbUser.auth_user,
                            'x-congrea-authpass': wbUser.auth_pass,
                            'x-congrea-room': wbUser.room
                        }
                    },
                    retry: {
                        enableAuto: false // defaults to false
                    },
                    cors: {
                        allowXdr: true,
                        expected: true,
                        sendCredentials: false
                    },

                    objectProperties: {
                        key: function (id) {
                            var congreaKey = wbUser.lkey;
                            var congreaRoom = wbUser.room;
                            virtualclass.gObj.file = {};

                            virtualclass.gObj.file.uuid = this.getUuid(id);
                            virtualclass.gObj.file.name = this.getName(id);

                            var file = {
                                name: this.getName(id),
                                uuid: this.getUuid(id)
                            }

                            virtualclass.gObj.uploadingFiles.push(file);

                            virtualclass.gObj.sessionInfo = {
                                key: congreaKey,
                                room: congreaRoom
                            }

                            return congreaKey + '/' + congreaRoom + '/' + virtualclass.gObj.file.uuid + '/' + this.getName(id);

                            // return congreaKey + '/' + congreaRoom + '/' +  virtualclass.gObj.file.uuid + '/' + this.getName(id);
                        }
                    },

                    callbacks: {
                        onComplete: function (id, xhr, rawData) {
                            if (obj.cthis == 'video') {
                                obj.cb.call(virtualclass.videoUl, id, xhr, rawData);
                                var msz = document.querySelector("#videoPopup .qq-upload-list-selector.qq-upload-list");
                                if (msz) {
                                    msz.style.display = "none";
                                }
                                virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                                virtualclass.vutil.makeElementActive('#listvideo');

                                var ul = document.querySelector('#uploadMsz .qq-upload-list-selector.qq-upload-list');
                                if (ul != null) {
                                    ul.style.display = 'block';
                                }
                                var lists = document.querySelectorAll('#uploadMsz .qq-upload-list-selector.qq-upload-list');
                                if (lists.length > 1) {
                                    for (var i = 1; i < lists.length - 1; i++) {
                                        lists[i].parentNode.removeChild(lists[i])
                                    }
                                }
                                virtualclass.vutil.removeChildrens('#VideoDashboard #uploadMsz .qq-upload-list-selector.qq-upload-list li');
                                var dashbaord = document.querySelector('#VideoDashboard');
                            } else if (obj.cthis == 'docs') {
                                obj.cb.call(virtualclass.dts, id, xhr, rawData);

                                virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                                virtualclass.vutil.makeElementActive('#listdocs');

                                var ul = document.querySelector('#docsuploadContainer #docsUploadMsz .qq-upload-list-selector.qq-upload-list');
                                if (ul != null) {
                                    ul.style.display = 'block';
                                }

                                virtualclass.vutil.removeChildrens('#docsUploadMsz .qq-upload-list-selector.qq-upload-list li');

                                var dashbaord = document.querySelector('#DocumentShareDashboard');

                            }
                            if (dashbaord != null) {
                                dashbaord.classList.remove('uploading');
                            }


                        },

                        onError: function () {
                            var alertMsz = document.querySelector(".dbContainer .alert");
                            if (alertMsz) {
                                alertMsz.parentNode.removeChild(alertMsz);
                            }

                            if (obj.cthis == 'video') {
                                var msz = document.querySelector("#videoPopup .qq-upload-list-selector.qq-upload-list");
                                if (msz) {
                                    msz.style.display = "none";
                                }
                                virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                                virtualclass.vutil.makeElementActive('#listvideo');


                            } else if (obj.cthis == 'docs') {
                                var msz = document.querySelector("#DocumentShareDashboard .qq-upload-list-selector.qq-upload-list");
                                if (msz) {
                                    msz.style.display = "none";
                                }
                                virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                                virtualclass.vutil.makeElementActive('#listdocs');
                            }
                        },

                        onSubmitted: function (id, name) {
                            this.setName(id, name.toLowerCase());

                            /**It handles the rendering the progressbar after done once **/

                            if (obj.cthis == 'video') {
                                var container = "#uploadMsz";
                                var selector = '#VideoDashboard';
                            } else if (obj.cthis == 'docs') {
                                var container = "#docsUploadMsz";
                                var selector = '#DocumentShareDashboard';
                            }

                            var dashboard = document.querySelector(selector);
                            dashboard.classList.add('uploading');

                            var msgclose = document.querySelector(container + ' .close');
                            if (msgclose != null) {
                                msgclose.click();
                            }
                            var uploadmsg = document.querySelector(container);
                            if (uploadmsg != null) {
                                uploadmsg.style.display = 'block';
                            }

                            var ul = document.querySelector(container + ' .qq-upload-list-selector.qq-upload-list');
                            ul.style.display = 'block';
                        }
                    },
                };

                // if(obj.hasOwnProperty('multiple')){
                //     dataObj.multiple = obj.multiple;
                // }

                // if(obj.hasOwnProperty('validation')){
                //     dataObj.allowedExtensions = obj.validation;
                // }

                var galleryUploader = new qq.s3.FineUploader(dataObj);
            },

            onDragEnter: function (e) {
                var tobeDeactive;
                if (virtualclass.currApp == 'DocumentShare') {
                    tobeDeactive = "#listnotes";
                    virtualclass.vutil.makeElementDeactive(tobeDeactive);
                    virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                } else if (virtualclass.currApp == 'Video') {
                    tobeDeactive = '#listvideo';
                    virtualclass.vutil.makeElementDeactive(tobeDeactive);
                    virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                }
            },
            onDragEnd: function (e) {


            }


        }
    }();
    window.fineUploader = fineUploader;
})(window);