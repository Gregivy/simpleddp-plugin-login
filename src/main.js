export const simpleDDPLogin = {
  init: function () {
    // user id
    this.userId = undefined;
    this._loggedIn = false;

    // login method
    this.login = (obj) => {
      return new Promise((resolve, reject) => {
        this.call('login',[obj]).then((m) => {
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
          this.call('logout').then((m) => {
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
      }
      //this.userId = undefined;
			this._loggedIn = false;
		});

    // try to resume when connection was lost and established again
    this.resumeEvent = this.on('connected',(m)=>{
			if (this.token && !this._loggedIn) {
        this.login({resume:this.token});
      }
		});
  }
}
