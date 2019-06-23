// This file is part of google
/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  const xhr = {
    init() {
      this.vxhr = axios.create({
        timeout: 10000,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          post: {
            'Content-Type': 'application/json',
          },
          get: {
            'Content-Type': 'application/json',
          },
        },
        onUploadProgress: ((progressEvent) => {
          virtualclass.xhr.onProgress(progressEvent);
        }),
      });
    },

    // this is not inbuilt onprogress
    onProgress(evt) {
      virtualclass.pbar.currVal = evt.loaded;
      if ((virtualclass.pbar.prvVal === '' || typeof virtualclass.pbar.prvVal === 'undefined')
        && !virtualclass.isPlayMode) {
        virtualclass.pbar.progressInit();
      }
      virtualclass.pbar.renderProgressBar(evt.total, evt.loaded, 'indProgressBar', 'indProgressValue');
    },
  };
  window.xhr = xhr;
}(window));
