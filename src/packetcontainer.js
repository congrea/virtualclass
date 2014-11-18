// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        var packContainer = function (){
            return {
                createPacketContDiv : function(id, clasName) {
                    var tag = document.createElement('div');
                    if (typeof id != 'undefined') {
                        tag.id = id;
                    }
                    if (typeof clasName != 'undefined') {
                        tag.clasName = clasName;
                    }
                    return tag;
                },
                
                
                togglePacketCont : function (cthis){
                   var classes = this.className.split(" ");
                   for(var i=0; i<classes.length; i++){
                       if(classes[i] == 'display'){
                           this.className = 'hide';
                           this.innerHTML = "+";
                           cthis._togglePacketCont(classes[i]);
                           break;
                       }else if(classes[i] == 'hide'){
                           this.className = 'display';
                           this.innerHTML = "-";
                           cthis._togglePacketCont(classes[i]);
                           break;
                       }
                   }
                },
                
                _togglePacketCont : function (label){
                    var style  = label == 'display' ? 'none' : 'block';
               
                    var heading = document.getElementById("dataInfoHeading");
                    heading.style.display = style;
                    
                    var packCont = document.getElementById("packetContainer");
                    packCont.style.display = style;
                    
                    var packCont = document.getElementById("informationCont");
                    packCont.style.display = style;
                },
                
                
                
                //creating divs about sending data per seconds and total
                createPacketContainer :function() {
                    //Creating Column Two.
                    var packetContainer = document.getElementById('packetContainer');
                    var headingTag = document.createElement("h4");
                    headingTag.id = 'dataInfoHeading';
                    headingTag.innerHTML = vApp.lang.getString('dataDetails');
                    
                    var toggleBox = document.createElement("div");
                    toggleBox.id = "toggleContainer";
                    toggleBox.className = "display";
                     
                    var that = this; 
                    toggleBox.addEventListener('click', function (){
                        that.togglePacketCont.call(this, that);
                        
                    });
                    
                    toggleBox.innerHTML = "-";
                    
                    var mainContainer = document.getElementById('mainContainer');
                    mainContainer.insertBefore(toggleBox, mainContainer.firstChild);

                    mainContainer.insertBefore(headingTag, packetContainer);
                    
                    var labelDiv = this.createPacketContDiv("dataInformation");
                    packetContainer.appendChild(labelDiv);

                    var blankDiv = this.createPacketContDiv("blankDiv");
                    blankDiv.innerHTML = "&nbsp;<br/>&nbsp;";
                    labelDiv.appendChild(blankDiv);

                    var perSecLabel = this.createPacketContDiv("perSecData");
                    perSecLabel.innerHTML = vApp.lang.getString('perSecond');
                    labelDiv.appendChild(perSecLabel);

                    var totalDataLabel = this.createPacketContDiv('totalDataLabel');
                    totalDataLabel.innerHTML = vApp.lang.getString('total');
                    labelDiv.appendChild(totalDataLabel);

                    //Creating Column Two.
                    var sentPackCont = this.createPacketContDiv('sendPackCont');
                    packetContainer.appendChild(sentPackCont);

                    var sendPacketPSLabel = this.createPacketContDiv('sentPacketsLabel');
                    sendPacketPSLabel.innerHTML = vApp.lang.getString('sentPackets');
                    sentPackCont.appendChild(sendPacketPSLabel);

                    var sendPacketPS = this.createPacketContDiv('sendPackPsCont');
                    sentPackCont.appendChild(sendPacketPS);

                    var counterDiv = this.createPacketContDiv(this.sentPackDivPS, 'numbers');
                    counterDiv.innerHTML = 0;
                    sendPacketPS.appendChild(counterDiv);

                    var totSendPacket = this.createPacketContDiv('totSendPackCont');
                    sentPackCont.appendChild(totSendPacket);

                    counterDiv = this.createPacketContDiv(this.sentPackDiv, 'numbers');
                    counterDiv.innerHTML = 0;
                    totSendPacket.appendChild(counterDiv);

                    //Creating Column Three.
                    var receviedPackCont = this.createPacketContDiv('receivePackCont');
                    packetContainer.appendChild(receviedPackCont);

                    var receivedPacketPSLabel = this.createPacketContDiv('receivedPacketsLabel');
                    receivedPacketPSLabel.innerHTML = vApp.lang.getString('receviedPackets');
                    receviedPackCont.appendChild(receivedPacketPSLabel);

                    var receivePacketPS = this.createPacketContDiv('receivePackPsCont');
                    receviedPackCont.appendChild(receivePacketPS);

                    counterDiv = this.createPacketContDiv(this.receivedPackDivPS, 'numbers');
                    counterDiv.innerHTML = 0;
                    receivePacketPS.appendChild(counterDiv);

                    var totReceivedPack = this.createPacketContDiv('totReceivedPackCont');
                    receviedPackCont.appendChild(totReceivedPack);

                    counterDiv = this.createPacketContDiv(this.receivedPackDiv, 'numbers');
                    counterDiv.innerHTML = 0;
                    totReceivedPack.appendChild(counterDiv);

                },

                //creating divs about sending data information in detail
                 createPacketInfoContainer : function() {
                    ///creating sent message information
                    var informationCont = document.getElementById('informationCont');
                    label = document.createElement('label');
                    label.innerHTML = vApp.lang.getString("sentMessageInfo");

                    var sentMsgInfoCont = this.createPacketContDiv('sentMsgInfoContainer');
                    sentMsgInfoCont.appendChild(label);

                    var sentMsgInfo = this.createPacketContDiv('sentMsgInfo');

                    sentMsgInfoCont.appendChild(sentMsgInfo);
                    informationCont.appendChild(sentMsgInfoCont);

                    var receivedMsgInfoCont = this.createPacketContDiv('receivedMsgInfoContainer');
                    label = document.createElement('label');
                    label.innerHTML = vApp.lang.getString("receivedMessageInfo");

                    receivedMsgInfoCont.appendChild(label);

                    var rcvdMsgInfo = this.createPacketContDiv('rcvdMsgInfo');
                    receivedMsgInfoCont.appendChild(rcvdMsgInfo);
                    informationCont.appendChild(receivedMsgInfoCont);
                }
            }
        };
        window.packContainer = packContainer;
    }
)(window);