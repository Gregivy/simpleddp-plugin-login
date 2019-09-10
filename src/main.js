export const simpleDDPLogin = {
  init: function () {
    // user id
    this.userId = undefined;
    this._loggedIn = false;

    // login method
    this.login = (obj, atStart = false) => {
      return new Promise((resolve, reject) => {
        this.apply('login',[obj],atStart).then((m) => {
          if (m && m.id) {
            this.userId = m.id;
            this.token = m.token;
            this._loggedIn = true;
            if (m.type == 'resume') {
              this.ddpConnection.emit('loginResume',m);
            } else {
              this.ddpConnection.emit('login',m);
            }
            resolve(m);
          } else {
            reject(m);
          }
        },reject);
      });
    };

    // logout method
    this.logout = () => {
      return new Promise((resolve, reject) => {
        if (this._loggedIn) {
          this.apply('logout').then((m) => {
            this.userId = undefined;
            this.token = undefined;
            this._loggedIn = false;
            this.ddpConnection.emit('logout');
            resolve();
          },reject);
        } else {
          resolve();
        }
      });
    };

    // when disconnected we need to login again on next connection
    this.logoutWhenDisconnectedEvent = this.on('disconnected',(m)=>{
      if (this.userId) {
        this.ddpConnection.emit('loginSessionLost',this.userId);
        this.ddpConnection.pauseQueue();
      }
      //this.userId = undefined;
			this._loggedIn = false;
		});

    this.clientReadyEvent = this.on('clientReady', () => {
      if (this.userId) {
        this.login({resume:this.token},true).catch((m)=>{
          this.ddpConnection.emit('loginResumeFailed',m);
        });
        this.ddpConnection.continueQueue();
      }
    });

  }
}
