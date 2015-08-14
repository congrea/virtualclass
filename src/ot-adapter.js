otAdapter = function () {
    'use strict';

    //function otAdapter(revision, doc, operations) {
    function otAdapter(editorInfo, etype) {
        etype = etype.charAt(0).toLowerCase() + etype.slice(1);


        //	this[etype] = {"operations" : ""};
        var vceditor = Vceditor.getvcEditor();
        if (editorInfo.operations && editorInfo.revision > editorInfo.operations.length) {
            // the operations have been truncated fill in the beginning with empty space
            var filler = [];
            filler[editorInfo.revision - editorInfo.operations.length - 1] = null;
            //	this[etype].operations = filler.concat(editorInfo.operations);
            this.operations = filler.concat(editorInfo.operations);
        } else {
            //this[etype].operations = editorInfo.operations ? editorInfo.operations : [];
            this.operations = editorInfo.operations ? editorInfo.operations : [];
        }

        // We pretend to be a server
        //var server = new vceditor.Server(editorInfo.doc, this[etype].operations);
        var server = new vceditor.Server(editorInfo.doc, this.operations);

        this.trigger = function (func) {
            this.callbacks[func].apply(this, Array.prototype.slice.call(arguments, 1));
        };


        this.teacherOT = function (sendData) {
            // TW : 1) Teacher do OT and send to all (Function this.teacherOT)
            var msg = this.doOT(sendData);
            //console.log('TW : 1 From Teacher');
            this.preSend(msg, true);
        };

        this.doOT = function (msg) {
            //TODO sholld be done by calling dynamic method invoke
            if (msg.eddata == 'virtualclass-editor-operation') {
                //display editor if not
                if (virtualclass.previous != 'EditorRich') {
                    if (etype == 'editorRich') {
                        virtualclass.currApp = "EditorRich";
                        //virtualclass.dispvirtualclassLayout();
                    } else if (etype == "editorCode") {
                        virtualclass.currApp = "EditorCode";
                    }
                    virtualclass.dispvirtualclassLayout(virtualclass.currApp);
                }
                var data = JSON.parse(msg.data);
                var wrapped = new vceditor.WrappedOperation(
                    vceditor.TextOperation.fromJSON(data.operation),
                    data.cursor && vceditor.Cursor.fromJSON(data.cursor)
                );

                // Might need to try catch here and if it fails wait a little while and
                // try again. This way if we receive operations out of order we might.p
                // be able to recover
                var wrappedPrime = server.receiveOperation(data.revision, wrapped);

                if (!wrappedPrime) {
                    debugger;
                    console.log('there is some problem on revision of history');
                    return;
                }

                msg.data = wrappedPrime.wrapped.toJSON();
                msg.meta = wrappedPrime.meta;


                //msg = {
                //    eddata: 'virtualclass-editor-operation',
                //    data: wrappedPrime,
                //    cf : 'eddata'
                //};
            }

            return msg;
        };

        this.processOp = function (event) {
            var msg = event.message;
            if (msg.hasOwnProperty('edFrom')) {
                event.fromUser.userid = msg.edFrom;
            }
            if (msg.hasOwnProperty('eddata')) {
                if (msg.eddata == 'virtualclass-editor-cursor') {
	                this.trigger('cursor', event.fromUser.userid, JSON.parse(msg.data)); //we need object for set other cursor
                } else if (msg.eddata == 'selection') {
                    this.trigger('selection', virtualclass.gObj.uid, msg.data);
                } else if (msg.eddata == 'virtualclass-editor-operation') {
                    this.trigger('operation', msg.data);
                    this.trigger('cursor', event.fromUser.userid, msg.meta);
                }
            } else {
                console.log('Editor : processOP - No EDDATA');
            }
        };

        /**
         * Student Writes
         * SW : 1) Msg sent to Teacher
         * SW : 2) Teacher do OT and send to all
         * SW : 3a) Msg is received to student (self) - Action : ACK
         * SW : 3b) Msg is received to students (others) - Action : Process
         * SW : 3c) Msg is received to Teacher (also a broadcaster) - Action : Process
         *
         * Teacher Writes
         * TW : 1) Teacher do OT and send to all (Function this.teacherOT)
         * TW : 2a) Msg is received to Teacher (self) - Action : ACK
         * TW : 2b) Msg is received to students - Action : Process
         * @param event
         */

        this.receivedMessage = function (event) {
		
            var msg = event.message;
            //console.log('in');
            // TW : 2
            if (event.fromUser.role == 't' && !msg.hasOwnProperty('edFrom')) {
                if (virtualclass.gObj.uRole == 't') {
                    // TW : 2a) Msg is received to Teacher (self) - Action : ACK
                    if (msg.eddata == 'virtualclass-editor-operation') {
                        //console.log('TW : 2a teacher ack');
                        this.trigger('ack'); // TODO If we add delay using settimeout it will cause errors. FIX IT.
						return;
					}
                } else {
                    // console.log('TW : 2b received @student');
                    // TW : 2b) Msg is received to students - Action : Process
                    this.processOp(event);
                }
            } else if (!msg.hasOwnProperty('edFrom') && event.fromUser.role != 't') {
                // SW : 1) Msg sent to Teacher
               // console.log('SW : 1 From Student');
                // SW : 2) Teacher do OT and send to all
                var op = this.doOT(msg);
                event.message = op;
                op.edFrom = event.fromUser.userid; // Adds edFrom message to identify who was original sender of message
                this.preSend(op, true);
                return;
            } else {
                // SW : 3
                if (msg.edFrom == virtualclass.gObj.uid) {
                //    console.log('SW : 3a student ack');
                    //  SW : 3a) Msg is received to student (self)
                    if (msg.eddata == 'virtualclass-editor-operation') {
                        this.trigger('ack');
                    }
                } else {
                 //   console.log('SW : 3bc received @process');
                    // SW : 3b) Msg is received to students (others)
                    // SW : 3c) Msg is received to Teacher (also a broadcaster)
                    this.processOp(event);
                }
            }
        }
    }

    //sending the opration
    otAdapter.prototype.sendOperation = function (revision, operation, cursor, etype) {
        if (typeof etype != 'undefined') {
            if (etype == 'richtext') {
                var editor = "editorRich";
            } else {
                var editor = "editorCode";
            }
        }

        var sendData = {
            eddata: 'virtualclass-editor-operation',
            data: JSON.stringify({
                revision: revision,
                operation: operation,
                cursor: cursor
            }),
            et: editor,
            cf: 'eddata'
        };

        console.log('from send operation ' + revision);

        this.beforeSend(sendData);
        var that = this;
        console.log("send operation");
    };

    otAdapter.prototype.sendSelection = function (selection) {
        this.beforeSend({
            eddata: 'selection',
            data: JSON.stringify(selection),
            cf: 'eddata'
        });
    };

    otAdapter.prototype.sendCursor = function (cursor) {
        //console.log("Send Cursor");
        this.beforeSend({
            eddata: 'virtualclass-editor-cursor',
            data: JSON.stringify(cursor),
            cf: 'eddata'
        });
    };

    otAdapter.prototype.registerCallbacks = function (cb) {
        this.callbacks = cb;
    };


    otAdapter.prototype.beforeSend = function (sendData) {
        if (virtualclass.gObj.uRole == 't') {
            this.teacherOT(sendData);
        } else {
            var teacherId = virtualclass.vutil.whoIsTeacher();
			sendData = this.setEditorTypeOnPacket(sendData);
            ioAdapter.sendUser(sendData, teacherId);
        }
    };

	otAdapter.prototype.setEditorTypeOnPacket = function (msg){
		if (msg.hasOwnProperty('eddata')) {
            if (msg.eddata != 'initVcEditor' && msg.eddata != 'virtualclass-editor-operation') {
                if (virtualclass.currApp == "EditorRich" || virtualclass.currApp == "editorRich") {
                    msg.et = 'editorRich';
                } else if (virtualclass.currApp == "EditorCode" || virtualclass.currApp == "editorCode") {
                    msg.et = 'editorCode';
                }
            }
        }
		return msg;
	};

    otAdapter.prototype.preSend = function (msg, sendall) {
        msg = this.setEditorTypeOnPacket(msg);
        if (typeof sendall == 'undefined' || sendall == false || sendall == null) {
            ioAdapter.mustSend(msg);
        } else {
            ioAdapter.mustSendAll(msg);
        }
    };

    otAdapter.prototype.teacherAck = function (msg) {
        if (msg.edddata == 'virtualclass-editor-operation' || msg.edddata == 'selection' ||
            msg.edddata == 'virtualclass-editor-cursor') {
            var that = this;
            setTimeout(function () {
                that.trigger('ack');
            }, 2);
        }
    };

    return otAdapter;
}();
