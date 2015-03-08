Template.uploadForm.events({
      'submit' : function(event){
        event.preventDefault();
        var inp = document.getElementById('file-select');
      var fileName = inp.value;
      fileName = new Date().getTime() + "_" + fileName.replace(/^.*\\/, "");
      fileName = fileName.replace(/[^0-9a-z.]/ig, "_");
      fileName = fileName.replace(/__+/g, "_");

      var file = inp.files[0];
      if (file) {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onloadend = function(){
           Meteor.call("upload_to_s3", fileName, reader.result);
        };
        var snip = {title: fileName, url:'http://s3.amazonaws.com/rebase-audio-samples/' + fileName};
        Snippets.insert(snip);
        console.log('snip', snip);
      }

      }

    });