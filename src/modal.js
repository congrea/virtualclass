/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function (window) {
  const modal = () => ({
    show(elem) {
      const element = document.querySelector(elem);
      if (element != null) {
        element.classList.add('in');
      }
    },

    hide() {
      const elem = document.querySelector(elem);
      if (elem != null) {
        elem.classList.add('fade');
      }
    },

    removeModal() {
      const modalElem = document.querySelector('#editPollModal');
      if (modalElem) {
        modalElem.parentNode.removeChild(modalElem);
      }
    },
    closeModalHandler(id) {
      const that = this;
      const close = document.querySelector(`#${id} .close`);
      if (close) {
        close.addEventListener('click', () => {
          that.removeModal();
        });
      }
    },
    hideModal() {
      const db = document.querySelector('#congdashboard');
      if (db) {
        db.className = 'modal fade';
      }
    },

    showModal() {
      const db = document.querySelector('#congdashboard');
      if (db) {
        db.className = 'modal in';
      }
    },

    attachpopupHandler(pollType, index, preview) {
      const cont = document.querySelector(`#qnText${pollType}${index}`);
      cont.insertAdjacentHTML('beforeend', preview);
      const content = document.querySelector(`#qnText${pollType}${index} .popover-content`);
      content.classList.add('hide');

      const elem = document.querySelector(`#qnText${pollType}${index} .popover-content`);
      cont.addEventListener('mouseover', () => {
        elem.classList.add('show');
        elem.classList.remove('hide');
      });
      cont.addEventListener('mouseleave', () => {
        elem.classList.remove('show');
        elem.classList.add('hide');
      });
    },

  });
  window.modal = modal();
}(window));
