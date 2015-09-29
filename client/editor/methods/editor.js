Template.editor.onRendered(function(){
  var editor_area = document.getElementById("editor_area");
  Session.set("editor_area",editor_area.value);
  if(Meteor.user()){
    Meteor.call('load', Meteor.user()['_id'],function(error,result){
      Session.set('notebooks',result);
      if (Session.get('notebooks') == undefined){
        console.log('once');
        Meteor.call('new_notebook', Meteor.user()['_id'],function(error,result){
          location.reload();
        });
      }
      else{
        console.log('twice');
        editor_area.value = Session.get('notebooks')['notebooks']['notebook_0']['page_0'];
        Session.set("editor_area",Session.get('notebooks')['notebooks']['notebook_0']['page_0']);
      }
      document.getElementById("save_page").addEventListener("click", function(){
        var text_a = Session.get("editor_area");
        var page_name = Session.get('page');
        var notebook_name = Session.get('notebook');
        Meteor.call('save_page', Meteor.user()['_id'],notebook_name,page_name,text_a,function(error,result){
          Meteor.call('load', Meteor.user()['_id'],function(error,result){
            Session.set('notebooks',result);
          });
        });
      });
    });
  }
  // $( "#editor_area" ).keydown(function(event) {
  //   event.stopPropagation();
  //   Session.set("editor_area",this.value);
  // });
  // $( "#editor_area" ).keypress(function(event) {
  //   event.stopPropagation();
  //   Session.set("editor_area",this.value);
  // });
  $( "#editor_area" ).keyup(function(event) {
    event.stopPropagation();
    Session.set("editor_area",this.value);
  });

});

Template.editor.helpers({
  render:function(){
    return Session.get("render");
  },
  page:function(){
    return Session.get("page");
  },
  notebook:function(){
    return Session.get("notebook");
  },
  menu:function(){
    var res = [];
    if(Session.get('notebooks') != undefined){
      var notebookz = Session.get('notebooks')['notebooks'];
      for(var key in notebookz){
        res.push('<h3 class="notebook">'+key+'/</h3>');
        var name = key;
        for(var sub_key in notebookz[key]){
          res.push('<a href="#" class="page" name="'+name+'">'+sub_key+'</a>');
        }
        res.push('<a href="#" class="new-page" name="'+name+'">+page</a>');
      }
      res.push('<a href="#" class="new-notebook">+notebook</a>')
    }
    return res;
  }
});
Template.editor.events({
  'click .page':function(event){
    var page = event.currentTarget;

    var text_a = Session.get("editor_area");
    var page_name = Session.get('page');
    var notebook_name = Session.get('notebook');
    Session.set('page', page.innerHTML);
    Session.set('notebook',page.name);
    Meteor.call('save_page', Meteor.user()['_id'],notebook_name,page_name,text_a,function(error,result){
      Meteor.call('load', Meteor.user()['_id'],function(error,result){
        Session.set('notebooks',result);
        var editor_area = document.getElementById("editor_area");
        editor_area.value = result['notebooks'][Session.get('notebook')][Session.get('page')];
        Session.set("editor_area",editor_area.value);
      });
    });
  },
  'click .new-page':function(event){
    var new_page = event.currentTarget;
      Meteor.call('new_page', Meteor.user()['_id'],new_page.name,function(error,result){
    });
    location.reload();
  },
  'click .new-notebook':function(event){
      Meteor.call('new_notebook', Meteor.user()['_id'],function(error,result){
    });
    location.reload();
  }
});
