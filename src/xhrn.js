// This file is part of google
/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  const xhrn = {
    init() {
      this.vxhrn = axios.create({
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': wbUser.lkey,
          'x-congrea-authuser': wbUser.auth_user,
          'x-congrea-authpass': wbUser.auth_pass,
          'x-congrea-room': wbUser.room,
          post: {
            'Content-Type': 'application/json',
          },
          get: {
            'Content-Type': 'application/json',
          },
        },
      });
    },

    getAccess() {
      this.vxhrn.get(virtualclass.api.access, { withCredentials: true })
        .then(() => {
          virtualclass.gObj.readyToCommunicate = true;
        })
        .catch((error) => {
          console.error('Request failed with error ', error);
          setTimeout(() => {
            virtualclass.xhrn.getAccess();
          }, 1000);
        });
    },

    async getAskQnAccess() {
      const result = await this.vxhrn.get(virtualclass.api.askQnsAccess);
      return (result.data) ? result : false;
    },
  };
  window.xhrn = xhrn;
}(window));
