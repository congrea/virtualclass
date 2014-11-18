// This file is part of vidyamantra - http://vidyamantra.com/
/**
 * JavaScript core library for messaging
 *
 * @package    iocore
 * @copyright  2014 Pinky Sharma  {@link http://vidyamantra.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
var io = {
    cfg : {},
    sock : null,
    wsuri : null,
    response : {},
    auth : false,
    error : null,
    uniquesids : null,

    init : function(cfg, callback) {
        this.cfg = cfg;
        this.wsconnect();
    },

    wsconnect : function(){
        io.wsuri = "wss://"+this.cfg.rid;
        console.log(this.cfg.rid);
        if ("WebSocket" in window) {
            this.sock = new WebSocket(io.wsuri);
        } else if ("MozWebSocket" in window) {
            this.sock = new MozWebSocket(io.wsuri);
        } else {
            console.log("Browser does not support WebSocket!");
            this.error = lang.wserror;
        }
        var scope = this;
        this.sock.onopen = function() {
            console.log("Connected to " + scope.cfg.rid);

            $.event.trigger({
                type: "connectionopen"
            });
            //authenticate user
            scope.userauthenticat();

            // user join chat room
            scope.addclient();
        }
        this.sock.binaryType = 'arraybuffer';
        this.sock.onmessage = function(e) {
            try{
                if(e.data instanceof ArrayBuffer){
                    console.log(e.data);                                     
                }
                var r1 = JSON.parse(e.data);

                if (r1.type == "joinroom"){
                    console.log("New user join room " + r1.users);
                    /* identifying new user from list*/
                    var newuser = null;
                    if(scope.uniquesids != null){
                        $.each(r1.clientids, function(i,v) {
                            if(scope.uniquesids[i] == undefined){
                                newuser = i;
                            }
                        });
                    }

                    scope.uniquesids = r1.clientids;
                    //update users
                    $.event.trigger({
                        type: "member_added",
                        message: r1.users,
                        newuser:newuser
                    });
                }

                if (r1.type == "broadcastToAll"){
                    console.log("json  : display msg");
                    var userto = '';
                    if(r1.userto != undefined){ userto = r1.userto; }
                    $.event.trigger({
                        type: "newmessage",
                        message: r1.m,
                        fromUser: r1.user,
                        toUser: userto
                    });
                }

                if (r1.type == "userleft"){
                    console.log("user logout");
                    var userto = '';
                    if(r1.userto != undefined){ userto = r1.userto; }
                    if(scope.uniquesids != null){
                        delete scope.uniquesids[r1.user.userid];
                    }

                    $.event.trigger({
                        type: "user_logout",
                        fromUser: r1.user,
                        message: 'offline',
                        toUser: userto
                    });
                }

                if (r1.type == "leftroom"){
                    console.log("member removed");
                    $.event.trigger({
                        type: "member_removed",
                        message: r1.users
                    });
                }

                if (r1.type == "Unauthenticated"){
                    console.log("Unauthenticated user");
                    $.event.trigger({
                        type: "authentication_failed",
                        message: 'Authentication failed'
                    });
                }

                if (r1.type == "Multiple_login"){
                    console.log("Multiple_login");
                    $.event.trigger({
                        type: "Multiple_login"
                    });
                }

            }catch(e){
                console.log("Error catched   : " + e);
                $.event.trigger({
                    type: "error",
                    message: e
                });
                return;
            }
        }

        this.sock.onerror = function(e) {
            scope.error = e;
            console.log('Error:' + e);
            $.event.trigger({
                type: "error",
                message: e
            });

        }
        this.sock.onclose = function(e) {
            console.log('Connection Closed');

            $.event.trigger({
                type: "connectionclose",
                message: e.reason
            });
            console.log("Connection closed (wasClean = " + e.wasClean + ", code = " + e.code + ", reason = '" + e.reason + "')");
            setTimeout(function(){scope.wsconnect()}, 5000);
        }
    },

    userauthenticat : function (){
        var obj = {
            cfun  : 'authenticate',
            arg : {'authuser':this.cfg.authuser, 'authpass':this.cfg.authpass}
        }
        var jobj = JSON.stringify(obj);
        this.sock.send(jobj);
    },

    addclient : function (){
        var obj = {
            cfun : 'joinroom',
            arg : {'client':this.cfg.userid, 'roomname':this.cfg.fastchatroom_name, 'user':this.cfg.userobj}
        }
        var jobj = JSON.stringify(obj);
        this.sock.send(jobj);
    },

    send : function(msg){
        var obj = {
                //cfun : 'broadcast',
                cfun : 'broadcastToAll',
                arg : {'msg':msg}
        }
        if(arguments.length > 1){
            var uid = arguments[1];// user id to  whom msg is intented
            obj.arg.touser = this.uniquesids[uid];
        }
        var jobj = JSON.stringify(obj);
        this.sock.send(jobj);
    },
    sendBinary : function(msg){
        //this.sock.binaryType = 'arraybuffer';
        var myArray = new ArrayBuffer(8);
	    var longInt8View = new Uint8Array(myArray);
	    for (var i=0; i<longInt8View.length; i++) {
		  longInt8View[i] = i;
	    }
        this.sock.send(longInt8View);
    },

    disconnect:function(){
        this.sock.onclose = function () {};
        this.sock.close();
        console.log("i am closing this connection");
    }
};