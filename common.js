Notebooks = new Mongo.Collection('notebooks');
Meteor.methods({
  'load':function(u){
    var notebooks = Notebooks.findOne({'user':u});
    return notebooks;
  },
  'new_notebook':function(u){
    var user_notebooks = Notebooks.findOne({'user':u});
    if (user_notebooks == undefined){
      Notebooks.insert({'user': u, 'notebooks':{'notebook_0':{'page_0':"#Hello, World!"}}});
    }
    else{
      var sum =0;
      for(var x in user_notebooks["notebooks"]){
        sum++;
        console.log(x);
      }
      var notebook_name = 'notebook_'+sum;
      user_notebooks["notebooks"][notebook_name] = {'page_0':"#Hello, World!"};
      Notebooks.update({'user':u}, user_notebooks);
    }
  },
  'new_page':function(u,notebook_name){
    var user_notebooks = Notebooks.findOne({'user':u});
    console.log(user_notebooks);
    console.log(user_notebooks["notebooks"][notebook_name]);
    var sum =0;
    for(var x in user_notebooks["notebooks"][notebook_name]){
      sum++;
      console.log(x);
    }
    var page_name = 'page_'+sum;
    user_notebooks["notebooks"][notebook_name][page_name] = "#Hello, World!";
    Notebooks.update({'user':u}, user_notebooks);
  },
  'save_page':function(u,notebook_name,page_name,text){
    var user_notebooks = Notebooks.findOne({'user':u});
    user_notebooks["notebooks"][notebook_name][page_name] = text;
    Notebooks.update({'user':u}, user_notebooks);
  }
});
