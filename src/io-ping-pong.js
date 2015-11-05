var ioPingPong = {

    ping: function (e) {
        "use strict";
        // When a new member is added, greet him with both broadcast and individual msg
        if (e.type == 'member_added' && roles.hasAdmin()) {
            var session = this.sessionName();
            var msg = {ping: 'ping', cf: 'pong', session: session};
            if (virtualclass.gObj.uid != virtualclass.jId) { // Only send to new member
                ioAdapter.mustSendUser(msg, virtualclass.jId);
                console.log('PING TO ' + virtualclass.jId);
                ioAdapter.mustSend(msg);
                console.log('PING BROADCAST');
            } else { // I am new, so send to all
                for (var i = 0; i < e.message.length; i++) {
                    if (e.message[i].userid != virtualclass.gObj.uid) { // Ignore self
                        ioAdapter.mustSendUser(msg, e.message[i].userid);
                        console.log('PING TO ' + e.message[i].userid);
                    }
                }
                ioAdapter.mustSend(msg);
                console.log('PING BROADCAST');
            }
        }
    },
    pong: function (e) {
        "use strict";
        if (e.toUser) {
            console.log('PONG TO ' + e.toUser.userid + ' from ' + e.fromUser.userid);
            var msg = {ping: 'pong', cf: 'pongAck'};
            ioAdapter.mustSendUser(msg, e.fromUser.userid);
            console.log('PONG ACK TO ' + e.fromUser.userid);
        } else {
            console.log('PONG BROADCAST from ' + e.fromUser.userid);
            this.verifySession(e);
        }

    },
    pongAck: function (e) {
        "use strict";
        console.log('PONG ACK FROM ' + e.fromUser.userid);
    },
    sessionName : function () {
        var session = localStorage.getItem('mySession');
        if (session === null) {
            session = this.setSession();
        }
        return session;
    },
    setSession: function () {
        "use strict";
        var session = randomString(32);
        localStorage.setItem('mySession', session);
        return session;
    },
    verifySession: function (e) {
        var msg = e.message;
        var session = msg.session;
        var localSession = localStorage.getItem('mySession');
        if(localSession != null){
            if (localSession !== session) { // We are good, if same;
                this.sessionDestroy(session, e);
            }
        } else {
            localStorage.setItem('mySession', session);
        }
    },
    /**
     * We will delete all data from local Storage and IndexedDB and begin a new session
     */
    sessionDestroy : function (session, e) {
        // TODO Finish Session and start gracefully
        if (!virtualclass.isPlayMode) {
            var uid = e.fromUser.userid;
            localStorage.removeItem('mySession');
            virtualclass.storage.config.endSession();
            localStorage.setItem('mySession', session);
            ioMissingPackets.validateAllVariables(uid);
            console.log('REFRESH SESSION');
        } else {
            localStorage.setItem('mySession', 'thisismyplaymode');
        }
    }
};