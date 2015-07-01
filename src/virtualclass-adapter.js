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
		}

		this.receivedMessage = function (event) {
			var msg = event.message;
			if (msg.hasOwnProperty('data')) {
				var data = JSON.parse(msg.data);
			//	if(data !=  null && (data.revision < virtualclass[etype].cmClient.revision)) {
				if(data !=  null && (data.revision < virtualclass[etype].cmClient.revision)) {
					//TODO handle for the older version which is less than 5
					//this should be dynamic
					if((virtualclass[etype].cmClient.revision - data.revision) > 5 ){ //if older version more than 5 revision
						console.log("should not update older revision if neweer version is available");
						return;
					}
				}
			}

			var wrapped;

			//TODO sholld be done by calling dynamic method invoke
			if (msg.eddata == 'virtualclass-editor-operation') {


				//display editor if not
				if(virtualclass.previous != 'EditorRich'){
					if(etype == 'editorRich'){
						virtualclass.currApp = "EditorRich"
						//virtualclass.dispvirtualclassLayout();
					} else if(etype == "editorCode") {
						virtualclass.currApp = "EditorCode";
						//virtualclass.dispvirtualclassLayout();
					}
					virtualclass.dispvirtualclassLayout(virtualclass.currApp);
				}

				wrapped = new vceditor.WrappedOperation(
					vceditor.TextOperation.fromJSON(data.operation),
					data.cursor && vceditor.Cursor.fromJSON(data.cursor)
				);

				// Might need to try catch here and if it fails wait a little while and
				// try again. This way if we receive operations out of order we might.p
				// be able to recover

				var wrappedPrime = server.receiveOperation(data.revision, wrapped);
				if(!wrappedPrime){ // there is some problem on revision of history
					return;
				}

				//console.log("new operation: " + wrapped);

				//this.regiseterCb.operation(wrappedPrime.wrapped.toJSON());
				//this.regiseterCb.cursor(wrappedPrime.meta);

				if (event.fromUser.userid == virtualclass.gObj.uid) {
					this.trigger('ack');
				} else {
					//this.trigger('trigger', data.operation);
					this.trigger('operation', wrappedPrime.wrapped.toJSON());
					this.trigger('cursor', event.fromUser.userid, wrappedPrime.meta);
				}

			} else if (msg.eddata == 'virtualclass-editor-cursor') {
				//var cursor = JSON.parse(msg.data);
				//this.trigger('cursor', cursor);

				//var cursor = JSON.parse(msg.data);
				this.trigger('cursor', event.fromUser.userid, data);

				//this.trigger('cursor', event.from.connectionId, cursor);
			} else if (msg.eddata == 'selection') {
				var selection = JSON.parse(msg.data);
				this.trigger('selection', virtualclass.gObj.uid, selection);
			}
		}
	};

	//sending the opration
	virtualclassAdapter.prototype.sendOperation = function (revision, operation, cursor, etype) {
		if(typeof etype != 'undefined'){
			if(etype == 'richtext'){
				var editor = "editorRich";
			}else{
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
			et: editor

		};


		io.send(sendData);
		var that = this;
		console.log("send operation");
	}

	virtualclassAdapter.prototype.sendSelection = function (selection) {
		//io.send({'selection' : selection});
		io.send({
			eddata: 'selection',
			data: JSON.stringify(selection)
		});
	};

	virtualclassAdapter.prototype.sendCursor = function (cursor) {
		//console.log("Send Cursor");
		io.send({
			eddata: 'virtualclass-editor-cursor',
			data: JSON.stringify(cursor)
		});
	};

	virtualclassAdapter.prototype.registerCallbacks = function (cb) {
		this.callbacks = cb;
	};

	return virtualclassAdapter;
}();
