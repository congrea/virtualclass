virtualclassAdapter = function () {
    'use strict';

    //function virtualclassAdapter(revision, doc, operations) {
    function virtualclassAdapter(editorInfo, etype) {
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
            var msg = this.doOT(sendData);
            //if (msg.eddata == 'virtualclass-editor-operation') {
            //    this.trigger('ack');
            //}
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
                    console.log('there is some problem on revision of history');
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
            if (msg.hasOwnProperty('eddata')) {
                if (msg.eddata == 'virtualclass-editor-cursor') {
                    this.trigger('cursor', event.fromUser.userid, msg.data);
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

        this.receivedMessage = function (event) {
            var wrappedPrime;
            var msg = event.message;

            if (msg.hasOwnProperty('edFrom') && virtualclass.gObj.uRole == 't') {
                this.processOp(event);
                return;
            }

            // When packet is received by self (Also Teacher) or from forwarded student
            //if ((event.fromUser.userid == virtualclass.gObj.uid &&  !msg.hasOwnProperty('edFrom')) || msg.edFrom == virtualclass.gObj.uid) {
            if ((event.fromUser.userid == virtualclass.gObj.uid &&  !msg.hasOwnProperty('edFrom')) || msg.edFrom == virtualclass.gObj.uid) {
                if (msg.eddata == 'virtualclass-editor-operation') {
                    this.trigger('ack');
                }
            } else if (event.fromUser.role == 't') { // When packet is received by Student From Teacher
                this.processOp(event);
            } else { // When packet is received by Teacher Form Student
                // Do OT, perform OP and send to all

                // TODO : Check if no data
                if (msg.hasOwnProperty('data')) {
                    var data = JSON.parse(msg.data);
                    if (data != null && (data.revision < virtualclass[etype].cmClient.revision)) {
                        //TODO handle for the older version which is less than 5
                        //this should be dynamic
                        if ((virtualclass[etype].cmClient.revision - data.revision) > 5) { //if older version more than 5 revision
                            console.log("should not update older revision if neweer version is available");
                            return;
                        }
                    }
                } else {
                    console.log('Editor : No Data');
                }
                var op = this.doOT(msg);
                event.message=op;
                op.edFrom=event.fromUser.userid;
                this.preSend(op, true);
                //this.processOp(event);
            }
        }
    }

    //sending the opration
    virtualclassAdapter.prototype.sendOperation = function (revision, operation, cursor, etype) {
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

        this.beforeSend(sendData);
        var that = this;
        console.log("send operation");
    };

    virtualclassAdapter.prototype.sendSelection = function (selection) {
        this.beforeSend({
            eddata: 'selection',
            data: JSON.stringify(selection),
            cf: 'eddata'
        });
    };

    virtualclassAdapter.prototype.sendCursor = function (cursor) {
        //console.log("Send Cursor");
        this.beforeSend({
            eddata: 'virtualclass-editor-cursor',
            data: JSON.stringify(cursor),
            cf: 'eddata'
        });
    };

    virtualclassAdapter.prototype.registerCallbacks = function (cb) {
        this.callbacks = cb;
    };


    virtualclassAdapter.prototype.beforeSend = function (sendData) {
        if (virtualclass.gObj.uRole == 't') {
            this.teacherOT(sendData);
        } else {
            var teacherId = virtualclass.vutil.whoIsTeacher();
            ioAdapter.sendUser(sendData, teacherId);
        }
    };


    virtualclassAdapter.prototype.preSend = function (msg, sendall) {
        if (msg.hasOwnProperty('eddata')) {
            if (msg.eddata != 'initVcEditor' && msg.eddata != 'virtualclass-editor-operation') {
                if (virtualclass.currApp == "EditorRich" || virtualclass.currApp == "editorRich") {
                    msg.et = 'editorRich';
                } else if (virtualclass.currApp == "EditorCode" || virtualclass.currApp == "editorCode") {
                    msg.et = 'editorCode';
                }
            }
        }
        if (typeof sendall == 'undefined' || sendall == false || sendall == null) {
            ioAdapter.mustSend(msg);
        } else {
            ioAdapter.mustSendAll(msg);
        }
    };

    virtualclassAdapter.prototype.teacherAck = function (msg) {
        if (msg.edddata == 'virtualclass-editor-operation' || msg.edddata == 'selection' ||
            msg.edddata == 'virtualclass-editor-cursor') {
            var that = this;
            setTimeout(function () {
                that.trigger('ack');
            }, 2);
        }
    };

    return virtualclassAdapter;
}();
