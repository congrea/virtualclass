const ioPingPong = {
  ping(e) {
    // When a new member is added, greet him with both broadcast and individual msg
    if (e.type === 'member_added') {
      if (roles.hasAdmin()) {
        const session = virtualclass.config.sessionName();
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
      await virtualclass.config.verifySession(e);
    }
  },
  pongAck(e) {
    // console.log(`PONG ACK FROM ${e.fromUser.userid}`);
  },
};
