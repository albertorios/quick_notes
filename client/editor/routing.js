Router.route('/', function () {
  Session.set("render",true);
  Accounts.onLogin(function(){
    this.stop();
    location.reload();
  });
  Session.set('notebook','notebook_0');
  Session.set('page','page_0');
  this.render('editor');
});
