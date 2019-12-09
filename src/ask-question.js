/**
 * This file is part of Vidyamantra - http:www.vidyamantra.com/
 * @Copyright 2019  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
*/
class AskQuestion {
  async init() {
    const config = {
      apiKey: 'AIzaSyDx4OisyZGmbcAx57s0zlwRlopPNNDqxSs',
      authDomain: 'vidyamantra-congrea.firebaseapp.com',
      databaseURL: 'https://vidyamantra-congrea.firebaseio.com',
      projectId: 'vidyamantra-congrea',
      storageBucket: 'vidyamantra-congrea.appspot.com',
      messagingSenderId: '1041362522462',
      appId: '1:1041362522462:web:19396cecc1c79a6dea7fcf',
      measurementId: 'G-PDLZDWQ06W',
    };
    const result = await this.authenticate(config);
    if (result && Object.prototype.hasOwnProperty.call(result, 'operationType')) {
      this.afterSignIn();
      this.collection = `${wbUser.lkey}_${wbUser.session}_${wbUser.room}`;
    } else {
      console.log(`There is some error${result}`);
    }
  }

  async authenticate(config) {
    firebase.initializeApp(config);
    if (!this.db) this.db = firebase.firestore();
    this.collection = `${wbUser.lkey}_${wbUser.session}_${wbUser.room}`;
    const result = await virtualclass.xhrn.getAskQnAccess();
    if (result) return firebase.auth().signInWithCustomToken(result.data);
    return false;
  }

  attachHandlerForRealTimeUpdate() {
    this.db.collection(this.collection)
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            console.log('ask question  ', change.doc.data());
          }
        });
      }, (error) => {
        console.log('ask question real time ', error);
      });
  }

  afterSignIn() {
    virtualclass.isPlayMode = true;
    if (virtualclass.isPlayMode) this.attachHandlerForRealTimeUpdate();
    this.loadInitialData();
  }

  loadInitialData() {
    this.db.collection(this.collection).get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        console.log('ask question read data ', doc.data());
      });
    }).catch((error) => {
      console.log('ask question read error ', error);
    });
  }

  sendToDatabase(data) {
    const readyData = data || {
      name: 'Los Angeles',
      action: 'edit',
      context: 'whiteboard',
      userid: Math.floor(Math.random() * 10000),
      content: 'What is the meaning of that thing ?',
      mode: 'comment',
      qid: '123_34324_cVzdyANmhNa4BNP4iN8pZzU9uExFLQ6z_VUkRDJ7L9tSW530tOPwl6pApWVpXEU3LqoR3jgup2dHkPDgr',
      ansId: '1235_34324_cVzdyANmhNa4BNP4iN8pZzU9uExFLQ6z_VUkRDJ7L9tSW530tOPwl6pApWVpXEU3LqoR3jgup2dHkPDgr',
    };

    const docName = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
    this.db.collection(this.collection).doc(docName.toString()).set(readyData)
      .then(() => {
        console.log('ask question write, Document successfully written! ', data);
      })
      .catch((error) => {
        console.error('ask question write, Error writing document: ', error);
      });
  }
}
