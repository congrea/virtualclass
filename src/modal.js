/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (window) {
    var modal = () => {
        return {
            show: function (elem) {
                var elem = document.querySelector(elem);
                if (elem != null) {
                    elem.classList.add("in")
                }
            },

            hide: function () {
                var elem = document.querySelector(elem);
                if (elem != null) {
                    elem.classList.add("fade")
                }
            },

            removeModal: function () {
                var modal = document.querySelector("#editPollModal");
                if (modal) {
                    modal.parentNode.removeChild(modal)
                }

            },
            closeModalHandler: function (id) {
                var that = this;
                var close = document.querySelector('#' + id + ' .close');
                if (close) {
                    close.addEventListener('click', function () {
                        that.removeModal();
                    });
                }
            },
            hideModal: function () {
                var db = document.querySelector('#congdashboard');
                if (db) {
                    db.className = "modal fade";
                }
            },
            showModal: function () {
                var db = document.querySelector('#congdashboard');
                if (db) {
                    db.className = "modal in";
                }
            },

            attachpopupHandler: function (pollType, index, preview) {
                var cont = document.querySelector('#qnText' + pollType + index);
                cont.insertAdjacentHTML('beforeend', preview)
                var content = document.querySelector('#qnText' + pollType + index + ' .popover-content');
                content.classList.add('hide');

                var elem = document.querySelector("#qnText" + pollType + index + " .popover-content");
                cont.addEventListener("mouseover", function () {
                    elem.classList.add("show");
                    elem.classList.remove("hide")

                });
                cont.addEventListener("mouseleave", function () {
                    elem.classList.remove("show")
                    elem.classList.add("hide")

                });
            },

        }
    }
    window.modal = modal()

})(window);

