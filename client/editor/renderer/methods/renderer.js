Template.renderer.onRendered(function(){
  document.getElementById("add_question").addEventListener("click", function(){
    Session.set("render",false);
  });
});

Template.renderer.helpers({
  render_notes:function(){
    var text = Session.get("editor_area");
    if(text != undefined){
      var result = [];
      var start = 0;
      while(start!=-1){
        start = text.indexOf("{{#mathjax}}", start);
        if(start != -1){
          result.push({type:true,value: text.substr(0, start)})
          text = text.substr(start+12, text.length);
          start =  text.indexOf("{{/mathjax}}", 0);
          result.push({type:false,value: text.substr(0, start)});
          text = text.substr(start+12, text.length);
          start=0;
        }
        else{
          start = -1;
          result.push({type:true,value: text.substr(0, text.length)})
        }
      }
      return result;
    }
  }
});
