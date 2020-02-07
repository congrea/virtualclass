const ioPingPong = {

  ping(e) {
    // When a new member is added, greet him with both broadcast and individual msg
    if (e.type === 'member_added') {
      if (roles.hasAdmin()) {
        const session = this.sessionName();
        const msg = { ping: 'ping', cf: 'pong', session };
        ioAdapter.sendWithDelayAndDrop(msg, null, 'mustSend', 'pingAll', 3000);
        // console.log('PING BROADCAST');
      }
    }
  },
  async pong(e) {
    if (e.toUser) {
      // console.log(`PONG TO ${e.toUser.userid} from ${e.fromUser.userid}`);
      const msg = { ping: 'pong', cf: 'pongAck' };
      ioAdapter.mustSendUser(msg, e.fromUser.userid);
      // console.log(`PONG ACK TO ${e.fromUser.userid}`);
    } else {
      // console.log(`PONG BROADCAST from ${e.fromUser.userid}`);
      await this.verifySession(e);
    }
  },
  pongAck(e) {
    // console.log(`PONG ACK FROM ${e.fromUser.userid}`);
  },
  sessionName() {
    let session = localStorage.getItem('mySession');
    if (session === null) {
      session = this.setSession();
    }
    return session;
  },
  setSession() {
    // const session = virtualclass.vutil.randomString(32);
    const session = localStorage.mySession;
    console.log('==== session 1, My session is created by setSession ', session, ' ', localStorage.mySession);
    virtualclass.config.setNewSession(session);
    return session;
  },
  async verifySession(e) {
    const msg = e.message;
    const { session } = msg;
    const localSession = localStorage.getItem('mySession');
    if (localSession != null) {
      // only destroy the session when the request comes from teacher
      if (localSession !== session && e.fromUser.role === 't') { // We are good, if same;
        await this.sessionDestroy(session, e);
      }
    } else {
      // console.log('==== session, start session');
      // console.log('My session is created');
      virtualclass.config.setNewSession(session);
      // if (roles.isStudent()) virtualclass.userInteractivity.init();
    }
  },
  /**
   * We will delete all data from local Storage and IndexedDB and begin a new session
   */
  async sessionDestroy(session, e) {
    // TODO Finish Session and start gracefully
    if (!virtualclass.isPlayMode) {
      // console.log('==== session, start session');
      const uid = e.fromUser.userid;
      localStorage.removeItem('mySession');
      await virtualclass.config.endSession();
      virtualclass.config.setNewSession(session);
      ioMissingPackets.validateAllVariables(uid);
      // console.log('REFRESH SESSION');
    } else {
      // console.log('==== session, end session');
      // console.log('My session is created');
      virtualclass.config.setNewSession('thisismyplaymode');
    }
  },
};
