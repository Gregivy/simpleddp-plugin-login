import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  if (!Meteor.users.findOne()) {
    Accounts.createUser({
      username: "admin",
      password: "admin"
    });
  }
});

Meteor.methods({
  'test'() {
    return {id:this.userId};
  }
});
