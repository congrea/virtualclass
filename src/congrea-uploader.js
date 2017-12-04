(function (window) {
    var fineUploader = function () {
        return {
             generateModal:function(type,elemArr){
                    var bsCont = document.getElementById(type+"PopupCont");
                    elem1Id="congreaVideoContBody";
                    elem2Id="congreaShareVideoUrlCont";
                    var modal = document.createElement("div");

                    modal.id = type+"Popup";
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
                    
                    elemArr.forEach(function(elemId){
                        virtualclass.fineUploader.createElems(divMain,elemId);
                        
                    });
                    
                    var elem = document.createElement("form");
                    elem.id = "form1";
                    content.appendChild(elem);


                    var footer = document.createElement("div");
                    footer.id = "contFooter";
                    footer.className = "modal-footer";
                    content.appendChild(footer);
                    
                    
                    
                },
                createElems:function(divMain,id){
                    var upload = document.createElement("div");
                    upload.id = id;
                    upload.className = "upload";
                    divMain.appendChild(upload);
               },
                
                
                initModal: function (type) {

                        $('#'+type+'Popup').modal({
                            backdrop: 'static',
                            keyboard: false
                        });
                        $('#'+type+'Popup').modal({
                            show: true
                        });

                        $('#'+type+'Popup').on('hidden.bs.modal', function () {
                            //virtualclass.poll.test(type)
                            $('#'+type+'Popup').remove();
                        });
                },
                 
            uploaderFn: function (obj) {
                var dataObj = {
                    debug: true,
                    element: obj.wrapper,
                    template: 'qq-template-gallery',
                    request: {
                        endpoint:obj.requesteEndPoint
                    },
                    
                    thumbnails: {
                        placeholders: {
                            waitingPath: window.whiteboardPath+'/fileuploader/js/placeholders/waiting-generic.png',
                            notAvailablePath:window.whiteboardPath +'/fileuploader/js/placeholders/not_available-generic.png'
                        }
                    },

                    callbacks: {
                         onComplete: function (id, xhr, rawData) {
                             if(obj.cthis == 'video'){
                                obj.cb.call(virtualclass.videoUl, id, xhr, rawData);
                                 var msz = document.querySelector("#videoPopup .qq-upload-list-selector.qq-upload-list");
                                 if(msz){
                                     msz.style.display="none";
                                 }

                             }else if (obj.cthis == 'docs'){
                                obj.cb.call(virtualclass.dts, id, xhr, rawData); 
                             }
                        },
                        onError:function(){
                            var alertMsz= document.querySelector(".dbContainer .alert");
                            if(alertMsz){
                                alertMsz.parentNode.removeChild(alertMsz);
                            }

                            if(obj.cthis == 'video'){
                                var msz = document.querySelector("#videoPopup .qq-upload-list-selector.qq-upload-list");
                                if(msz){
                                    msz.style.display="none";
                                }
                            }else if (obj.cthis == 'docs'){
                                var msz = document.querySelector("#DocumentShareDashboard .qq-upload-list-selector.qq-upload-list");
                                if(msz){
                                    msz.style.display="none";
                                }
                            }

                        }

                    },

                    validation: {
                        allowedExtensions:obj.validation
                    }
                };
                
                if(obj.hasOwnProperty('multiple')){
                    dataObj.multiple = obj.multiple;
                }
                
                if(obj.hasOwnProperty('validation')){
                    dataObj.allowedExtensions = obj.validation;
                }
                var galleryUploader = new qq.FineUploader(dataObj);
            },

            onDragEnter : function (e){
              var tobeDeactive;
              if(virtualclass.currApp == 'DocumentShare'){
                tobeDeactive = "#listnotes";
                virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
              }else if(virtualclass.currApp == 'Video'){
                tobeDeactive = '#listvideo';
              }
              virtualclass.vutil.makeElementDeactive(tobeDeactive );
              virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
            }
        }
    }();
   window.fineUploader= fineUploader;
})(window);