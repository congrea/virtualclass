/**
 * This file is part of Vidyamantra - http:www.vidyamantra.com/
 * @Copyright 2019  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
*/
// This class is responsible to render HTML of each component of Ask Question
// like html question, comment etc
class AskQuestionRenderer {
  question() {
    console.log('html renderer question ');
  }

  answer() {
    console.log('html renderer answer');
  }

  comment() {
    console.log('html renderer comment');
  }

  // This is reponsible to create main interface of ask question
  coreInterface() {
    console.log('html renderer core interface');
  }

}

class AskQuestionEngine extends AskQuestionRenderer {
  constructor() {
    super();
    this.queue = [];
  }

  // TODO, find better way to perform this
  perform() {
    while (this.queue.length > 0) {
      const data = this.queue.shift();
      this[data.action].call(this, data);
    }
    this.queue.length = 0;
  }

  performWithQueue(data) {
    this.queue.push(data);
    this.perform();
  }

  queue(data) {
    this.queue.push(data);
  }

  create(data) {
    //  data.component = 'question'
    //  data.id = q_userId_timetamp
    //  data.action = 'create'
    // perform your logic here related to create question
    // super.question(data);
    this[data.component].call();
  }

  delete(data) {
    // perform your logic here related to delete question
    console.log('Delete question',  data);
  }

  edit(data) {
    console.log('Edit question',  data);
  }

  upvote(data) {
    // const data = {};
    // data.component = 'question';
    // data.id = '12345';
    // data.action = 'upvote';

    // When user upvote first time this will be invoked
    if (data.firstTime) {
      this.sendToDatabase(data);
    } else {
      this.db.collection(this.collection).doc(data.id).update(data.action, firebase.firestore.FieldValue.increment(1));
    }
  }
}

class AskQuestion extends AskQuestionEngine {
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
          if (change.type === 'modified') {
            console.log('ask question modified ', change.doc.data());
          }
        });
      }, (error) => {
        console.log('ask question real time ', error);
      });
  }

  afterSignIn() {
    // this.loadInitialData();
    this.attachHandlerForRealTimeUpdate();
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
    const docName = firebase.firestore.Timestamp.fromDate(new Date()).seconds;
    this.db.collection(this.collection).doc(docName.toString()).set(data)
      .then(() => {
        console.log('ask question write, Document successfully written! ', data);
      })
      .catch((error) => {
        console.error('ask question write, Error writing document: ', error);
      });
  }
}
