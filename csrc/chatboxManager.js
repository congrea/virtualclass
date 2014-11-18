// Need this to make IE happy
if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
    for(var i = 0; i < this.length; i++){
        if(this[i] == obj){
            return i;
        }
    }
    return -1;
    }
}

//Manage chatbox
var chatboxManager = function() {
    // list of all opened boxes
    var boxList = new Array();
    // list of boxes shown on the page
    var showList = new Array();
    // list of first names, for in-page demo
    //var nameList = new Array();

    var config = {
        width : 230, //px
        gap : 20,
        maxBoxes : 5,
        messageSent : function(id,dest, msg) {
            // override this
            $("#" + id).chatbox("option", "boxManager").addMsg(dest, msg);
        }
    };

    var init = function(options) {
        $.extend(config, options)
    };

    var delBox = function(id) {
        // TODO
        var remove = id;
        showList = $.grep(showList, function(id) {
            return remove != id;
            });
        boxList = $.grep(boxList, function(id) {
            return remove != id;
            });
        //boxList.remove(id);
    };

    var getNextOffset = function() {
        return 285 + (config.width + config.gap) * showList.length;
    };

    var boxClosedCallback = function(id) {
        // close button in the titlebar is clicked

        var idx = showList.indexOf(id);
        if(idx != -1) {
            showList.splice(idx, 1);
            boxList.splice(idx, 1); //removed if tab is hidden
            diff = config.width + config.gap;
            for(var i = idx; i < showList.length; i++) {
                offset = $("#" + showList[i]).chatbox("option", "offset");
                $("#" + showList[i]).chatbox("option", "offset", offset - diff);
            }
        }else {
            alert("should not happen: " + id);
        }
    };

    // caller should guarantee the uniqueness of id
    var addBox = function(id, user, name) {
        var idx1 = showList.indexOf(id);
        var idx2 = boxList.indexOf(id);
        if(idx1 != -1) {
            // found one in show box, do nothing
        }
        else if(idx2 != -1) {
            // exists, but hidden
            // show it and put it back to showList

            $("#" + id).chatbox("option", "offset", getNextOffset());
            var manager = $("#" + id).chatbox("option", "boxManager");
            manager.toggleBox();
            showList.push(id);

            var index = -1;

            index = $('#tabs li').index($("#tabcb" + id));
            $($('.tabs li')[index]).css('display','list-item');

            $('#tabs').tabs( "option", "active", index);

            $('#tabs').tabs('show');
        }else{

            if(user.last_name == undefined){ user.last_name = '';}
            var elm = document.createElement('div');
            elm.setAttribute('id', id);
            $(elm).chatbox({id : id,
               user : user,
               title : user.first_name + " " + user.last_name,
               hidden : false,
               width : config.width,
               offset : getNextOffset(),
               messageSent : messageSentCallback,
               boxClosed : boxClosedCallback
              });
            boxList.push(id);
            showList.push(id);
        }
    };

    var messageSentCallback = function(id,user, msg) {
        var idx = boxList.indexOf(user.userid);
        config.messageSent(id,user, msg);
    };

    var dispatch = function(user, msg) {
        $("#" + user.userid).chatbox("option", "boxManager").addMsg(user.name, msg);
    }

    return {
        init : init,
        addBox : addBox,
        delBox : delBox,
        dispatch : dispatch
    };
}();