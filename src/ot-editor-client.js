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
    "use strict";
    var EditorClient = (function () {
        'use strict';

        var Client = window.Client;
        var Cursor = window.Cursor;
        var UndoManager = window.UndoManager;
        var TextOperation = window.TextOperation;
        var WrappedOperation = window.WrappedOperation;

        //var Client = ot.Client;
        //var Cursor = ot.Cursor;
        //var Selection = ot.Selection;
        //var UndoManager = ot.UndoManager;
        //var TextOperation = ot.TextOperation;
        //var WrappedOperation = ot.WrappedOperation;

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
                this.cursorAfter ? this.cursorAfter.transform(operation) : null
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
            this.color = "#86BA7D";
            this.removeCursor();
            this.cursor = cursor;
            this.mark = this.editorAdapter.setOtherCursor(
                cursor,
                this.color,
                this.id
            );
        };

        OtherClient.prototype.removeCursor = function () {
            if (this.mark) {
                this.mark.clear();
            }
        };


        function EditorClient(revision, clients, serverAdapter, editorAdapter) {


            //function EditorClient (serverAdapter, editorAdapter) {
            Client.call(this, revision);
            this.serverAdapter = serverAdapter;
            this.editorAdapter = editorAdapter;
            this.undoManager = new UndoManager();

            this.clients = {};

            var self = this;

            this.editorAdapter.registerCallbacks({
                change: function (operation, inverse) {
                    self.onChange(operation, inverse);
                },
                cursorActivity: function () {
                    self.onCursorActivity();
                },
                blur: function () {
                    self.onBlur();
                },
                focus: function () {
                    self.onFocus();
                }
            });
            this.editorAdapter.registerUndo(function () {
                self.undo();
            });
            this.editorAdapter.registerRedo(function () {
                self.redo();
            });


            this.serverAdapter.registerCallbacks({
                client_left: function (clientId) {
                    self.onClientLeft(clientId);
                },
                set_name: function (clientId, name) {
                    self.getClientObject(clientId).setName(name);
                },
                ack: function () {
                    self.serverAck();
                },
                operation: function (operation) {
                    self.applyServer(TextOperation.fromJSON(operation));
                },

                cursor: function (clientId, cursor) {
                    if (cursor) {
                        self.getClientObject(clientId).updateCursor(
                            self.transformCursor(Cursor.fromJSON(cursor))
                        );
                    } else {
                        self.getClientObject(clientId).removeCursor();
                    }
                },

                clients: function (clients) {
                    var clientId;
                    for (clientId in self.clients) {
                        if (self.clients.hasOwnProperty(clientId) && !clients.hasOwnProperty(clientId)) {
                            self.onClientLeft(clientId);
                        }
                    }

                    for (clientId in clients) {
                        if (clients.hasOwnProperty(clientId)) {
                            var clientObject = self.getClientObject(clientId);

                            if (clients[clientId].name) {
                                clientObject.setName(clients[clientId].name);
                            }

                            var selection = clients[clientId].selection;
                            if (selection) {
                                self.clients[clientId].updateSelection(
                                    self.transformSelection(Selection.fromJSON(selection))
                                );
                            } else {
                                self.clients[clientId].removeSelection();
                            }
                        }
                    }
                },
                reconnect: function () {
                    self.serverReconnect();
                }
            });

        }

        inherit(EditorClient, Client);

        EditorClient.prototype.getClientObject = function (clientId) {
            var client = this.clients[clientId];
            if (client) {
                return client;
            }
            return this.clients[clientId] = new OtherClient(
                clientId,
                this.editorAdapter
            );
        };

        EditorClient.prototype.applyUnredo = function (operation) {
            this.undoManager.add(this.editorAdapter.invertOperation(operation));
            this.editorAdapter.applyOperation(operation.wrapped);
            this.cursor = operation.meta.cursorAfter;
            if (this.cursor)
                this.editorAdapter.setCursor(this.cursor);
            this.applyClient(operation.wrapped);
        };

        EditorClient.prototype.undo = function () {
            var self = this;
            if (!this.undoManager.canUndo()) {
                return;
            }
            this.undoManager.performUndo(function (o) {
                self.applyUnredo(o);
            });
        };

        EditorClient.prototype.redo = function () {
            var self = this;
            if (!this.undoManager.canRedo()) {
                return;
            }
            this.undoManager.performRedo(function (o) {
                self.applyUnredo(o);
            });
        };

        EditorClient.prototype.onChange = function (textOperation, inverse) {
            var cursorBefore = this.cursor;
            this.updateCursor();

            var compose = this.undoManager.undoStack.length > 0 &&
                inverse.shouldBeComposedWithInverted(last(this.undoManager.undoStack).wrapped);
            var inverseMeta = new SelfMeta(this.cursor, cursorBefore);
            this.undoManager.add(new WrappedOperation(inverse, inverseMeta), compose);
            this.applyClient(textOperation);
        };

        EditorClient.prototype.updateCursor = function () {
            this.cursor = this.editorAdapter.getCursor();
        };

        EditorClient.prototype.onCursorActivity = function () {
            var oldCursor = this.cursor;
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
            this.serverAdapter.sendCursor(cursor);
        };

        EditorClient.prototype.sendOperation = function (revision, operation) {
            //this.editorAdapter.cm.options.keyMap is editor type need to send with each operation
            // becuase at very speed, when switching the editor, vApp.currApp is not playing correctly at io.lib.js
            // vApp.currApp is containg the older application but should be contain latest as app
            // we should know about text is comming from which Editor from richtext editor or OR code editor
            this.serverAdapter.sendOperation(revision, operation.toJSON(), this.cursor, this.editorAdapter.cm.options.keyMap);
        };

        //EditorClient.prototype.sendOperation = function (operation) {
        //  this.serverAdapter.sendOperation(operation);
        //  //this.emitStatus();
        //};

        EditorClient.prototype.applyOperation = function (operation) {
            this.editorAdapter.applyOperation(operation);
            this.updateCursor();
            this.undoManager.transform(new WrappedOperation(operation, null));
        };

        EditorClient.prototype.emitStatus = function () {
            var self = this;
            setTimeout(function () {
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

})(window);
