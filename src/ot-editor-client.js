// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**
 * By this file we are creating the Editor
 * It depends on parameters what kind of editor(Rich Text or Code editor would be created)
 *
 * @Copyright 2015  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 *
 *
 */
(function (window) {
  let latestPacket = 0;
  let latestCursorPacket = 0;
  let sendSelection = null;
  'use strict';
  const EditorClient = (function () {
    const { Client } = window;
    const { Cursor } = window;
    const { UndoManager } = window;
    const { TextOperation } = window;
    const { WrappedOperation } = window;

    // var Client = ot.Client;
    // var Cursor = ot.Cursor;
    // var Selection = ot.Selection;
    // var UndoManager = ot.UndoManager;
    // var TextOperation = ot.TextOperation;
    // var WrappedOperation = ot.WrappedOperation;

    function SelfMeta(cursorBefore, cursorAfter) {
      this.cursorBefore = cursorBefore;
      this.cursorAfter = cursorAfter;
    }

    SelfMeta.prototype.invert = function () {
      return new SelfMeta(this.cursorAfter, this.cursorBefore);
    };

    SelfMeta.prototype.compose = function (other) {
      return new SelfMeta(this.cursorBefore, other.cursorAfter);
    };

    SelfMeta.prototype.transform = function (operation) {
      return new SelfMeta(
        this.cursorBefore ? this.cursorBefore.transform(operation) : null,
        this.cursorAfter ? this.cursorAfter.transform(operation) : null,
      );
    };

    function OtherClient(id, editorAdapter) {
      this.id = id;
      this.editorAdapter = editorAdapter;

      this.li = document.createElement('li');
    }

    OtherClient.prototype.setColor = function (color) {
      this.color = color;
    };

    OtherClient.prototype.updateCursor = function (cursor) {
      this.color = '#86BA7D';
      this.removeCursor();
      this.cursor = cursor;
      this.mark = this.editorAdapter.setOtherCursor(
        cursor,
        this.color,
        this.id,
      );
    };

    OtherClient.prototype.removeCursor = function () {
      if (this.mark) {
        this.mark.clear();
      }
    };


    function EditorClient(revision, clients, serverAdapter, editorAdapter) {
      // function EditorClient (serverAdapter, editorAdapter) {
      Client.call(this, revision);
      this.serverAdapter = serverAdapter;
      this.editorAdapter = editorAdapter;
      this.undoManager = new UndoManager();

      this.clients = {};

      const self = this;

      this.editorAdapter.registerCallbacks({
        change(operation, inverse) {
          self.onChange(operation, inverse);
        },
        cursorActivity() {
          self.onCursorActivity();
        },
        blur() {
          self.onBlur();
        },
        focus() {
          self.onFocus();
        },
      });
      this.editorAdapter.registerUndo(() => {
        self.undo();
      });
      this.editorAdapter.registerRedo(() => {
        self.redo();
      });


      this.serverAdapter.registerCallbacks({
        client_left(clientId) {
          self.onClientLeft(clientId);
        },
        set_name(clientId, name) {
          self.getClientObject(clientId).setName(name);
        },
        ack() {
          self.serverAck();
        },
        operation(operation) {
          self.applyServer(TextOperation.fromJSON(operation));
        },

        cursor(clientId, cursor) {
          if (cursor) {
            self.getClientObject(clientId).updateCursor(
              self.transformCursor(Cursor.fromJSON(cursor)),
            );
          } else {
            self.getClientObject(clientId).removeCursor();
          }
        },

        clients(clients) {
          let clientId;
          for (clientId in self.clients) {
            if (Object.prototype.hasOwnProperty.call(self.clients, clientId) && !Object.prototype.hasOwnProperty.call(clients, clientId)) {
              self.onClientLeft(clientId);
            }
          }

          for (clientId in clients) {
            if (Object.prototype.hasOwnProperty.call(clients, clientId)) {
              const clientObject = self.getClientObject(clientId);

              if (clients[clientId].name) {
                clientObject.setName(clients[clientId].name);
              }

              const { selection } = clients[clientId];
              if (selection) {
                self.clients[clientId].updateSelection(
                  self.transformSelection(Selection.fromJSON(selection)),
                );
              } else {
                self.clients[clientId].removeSelection();
              }
            }
          }
        },
        reconnect() {
          self.serverReconnect();
        },
      });
    }

    inherit(EditorClient, Client);

    EditorClient.prototype.getClientObject = function (clientId) {
      const client = this.clients[clientId];
      if (client) {
        return client;
      }
      return this.clients[clientId] = new OtherClient(
        clientId,
        this.editorAdapter,
      );
    };

    EditorClient.prototype.applyUnredo = function (operation) {
      this.undoManager.add(this.editorAdapter.invertOperation(operation));
      this.editorAdapter.applyOperation(operation.wrapped);
      this.cursor = operation.meta.cursorAfter;
      if (this.cursor) this.editorAdapter.setCursor(this.cursor);
      this.applyClient(operation.wrapped);
    };

    EditorClient.prototype.undo = function () {
      const self = this;
      if (!this.undoManager.canUndo()) {
        return;
      }
      this.undoManager.performUndo((o) => {
        self.applyUnredo(o);
      });
    };

    EditorClient.prototype.redo = function () {
      const self = this;
      if (!this.undoManager.canRedo()) {
        return;
      }
      this.undoManager.performRedo((o) => {
        self.applyUnredo(o);
      });
    };

    EditorClient.prototype.onChange = function (textOperation, inverse) {
      const cursorBefore = this.cursor;
      this.updateCursor();

      const compose = this.undoManager.undoStack.length > 0
        && inverse.shouldBeComposedWithInverted(last(this.undoManager.undoStack).wrapped);
      const inverseMeta = new SelfMeta(this.cursor, cursorBefore);
      this.undoManager.add(new WrappedOperation(inverse, inverseMeta), compose);
      this.applyClient(textOperation);
    };

    EditorClient.prototype.updateCursor = function () {
      this.cursor = this.editorAdapter.getCursor();
    };

    EditorClient.prototype.onCursorActivity = function () {
      const oldCursor = this.cursor;
      this.updateCursor();
      if (!this.focused || oldCursor && this.cursor.equals(oldCursor)) {
        return;
      }
      this.sendCursor(this.cursor);
    };

    EditorClient.prototype.onBlur = function () {
      this.cursor = null;
      this.sendCursor(null);
      this.focused = false;
    };

    EditorClient.prototype.onFocus = function () {
      this.focused = true;
      this.onCursorActivity();
    };

    EditorClient.prototype.sendCursor = function (cursor) {
      if (this.state instanceof Client.AwaitingWithBuffer) {
        return;
      }

      if (cursor != null && Object.prototype.hasOwnProperty.call(cursor, 'position')) {
        var startPosition = cursor.position;
      }


      if (cursor != null && Object.prototype.hasOwnProperty.call(cursor, 'selectionEnd')) {
        var { selectionEnd } = cursor;
      }

      if (latestPacket === 0) {
        if (startPosition != null && selectionEnd != null) {
          this.serverAdapter.sendCursor(cursor);
          latestPacket = 1;
        } else {
          this.serverAdapter.sendCursor(cursor);
        }
      } else if (startPosition != null && selectionEnd != null) {
        if (sendSelection != null) {
          clearTimeout(sendSelection);
        }
        latestCursorPacket = cursor;
        const that = this;
        sendSelection = setTimeout(
          () => {
            that.serverAdapter.sendCursor(cursor);
            latestCursorPacket = null;
          }, 300,
        );
      } else { // not selection
        if (latestCursorPacket != null) {
          this.serverAdapter.sendCursor(latestCursorPacket);
          latestCursorPacket = null;
        }
        this.serverAdapter.sendCursor(cursor);
        latestPacket = 0;
      }
      startPosition = null;
      selectionEnd = null;
    };

    EditorClient.prototype.sendOperation = function (revision, operation) {
      // this.editorAdapter.cm.options.keyMap is editor type need to send with each operation
      // becuase at very speed, when switching the editor, vApp.currApp is not playing correctly at io.lib.js
      // vApp.currApp is containg the older application but should be contain latest as app
      // we should know about text is comming from which Editor from richtext editor or OR code editor
      this.serverAdapter.sendOperation(revision, operation.toJSON(), this.cursor, this.editorAdapter.cm.options.keyMap);
    };

    // EditorClient.prototype.sendOperation = function (operation) {
    //  this.serverAdapter.sendOperation(operation);
    //  //this.emitStatus();
    // };

    EditorClient.prototype.applyOperation = function (operation) {
      this.editorAdapter.applyOperation(operation);
      this.updateCursor();
      this.undoManager.transform(new WrappedOperation(operation, null));
    };

    EditorClient.prototype.emitStatus = function () {
      const self = this;
      setTimeout(() => {
        self.trigger('synced', self.state instanceof Client.Synchronized);
      }, 0);
    };

    // Set Const.prototype.__proto__ to Super.prototype
    function inherit(Const, Super) {
      function F() {
      }

      F.prototype = Super.prototype;
      Const.prototype = new F();
      Const.prototype.constructor = Const;
    }

    function last(arr) {
      return arr[arr.length - 1];
    }

    return EditorClient;
  }());

  window.EditorClient = EditorClient;
}(window));
