//this should be seprated
virtualclassAdapter = function () {
	'use strict';

	function virtualclassAdapter(revision, doc, operations) {
		if (operations && revision > operations.length) {
			// the operations have been truncated fill in the beginning with empty space
			var filler = [];
			filler[revision - operations.length - 1] = null;
			this.operations = filler.concat(operations);
		} else {
			this.operations = operations ? operations : [];
		}

		// We pretend to be a server
		var server = new ot.Server(doc, this.operations);
		this.trigger = function (func) {
			this.callbacks[func].apply(this, Array.prototype.slice.call(arguments, 1));
		}

		this.receivedMessage = function (event) {
			var msg = event.message;
			if (msg.hasOwnProperty('data')) {
				var data = JSON.parse(msg.data);
				if(data !=  null && data.revision < virtualclass.editor.cmClient.revision) {
					console.log("should not update older revision");
					return;
				}
			}


			var wrapped;

			//TODO sholld be done by calling dynamic method invoke
			if (msg.eddata == 'virtualclass-editor-operation') {
					//display editor if not
					if(virtualclass.previous != 'Editor'){
						virtualclass.currApp = "Editor"
						virtualclass.dispvirtualclassLayout();
					}

					wrapped = new ot.WrappedOperation(
						ot.TextOperation.fromJSON(data.operation),
						data.cursor && ot.Cursor.fromJSON(data.cursor)
					);

					// Might need to try catch here and if it fails wait a little while and
					// try again. This way if we receive operations out of order we might
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

	virtualclassAdapter.prototype.sendOperation = function (revision, operation, cursor) {
		var sendData = {
			eddata: 'virtualclass-editor-operation',
			data: JSON.stringify({
			revision: revision,
			operation: operation,
			cursor: cursor
			})
		};
		io.send(sendData);
		var that = this;
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
