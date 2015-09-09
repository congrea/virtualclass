Server = (function (global) {
    'use strict';

    // Constructor. Takes the current document as a string and optionally the array
    // of all operations.
    function Server(document, operations) {
        this.document = document;
        this.operations = operations || [];
    }

    // Call this method whenever you receive an operation from a client.
    Server.prototype.receiveOperation = function (revision, operation) {
        console.log('Operations ' + this.operations.length + ' Revision ' + revision);
        if (revision < 0 || this.operations.length < revision) {

            //if(revision > 1 ){
            //	virtualclass.editorRich.requestData('from_s');
            //}
            //throw  Ernewror("operation revision not in history");
            console.log("operation revision " + revision + " not in history");
            return false;
        }

        // Find all operations that the client didn't know of when it sent the
        // operation ...
        var concurrentOperations = this.operations.slice(revision);
        //console.log('conc operation ' + concurrentOperations.length);
        // ... and transform the operation against all these operations ...
        var transform = operation.constructor.transform;
        for (var i = 0; i < concurrentOperations.length; i++) {
            //console.log('transforming');
            operation = transform(operation, concurrentOperations[i])[0];
        }

        // ... and apply that on the document.
        this.document = operation.apply(this.document);
        // Store operation in history.
        this.operations.push(operation);

        // It's the caller's responsibility to send the operation to all connected
        // clients and an acknowledgement to the creator.
        return operation;
    };

    return Server;

}(this));

if (typeof module === 'object') {
    module.exports = ot.Server;
}

