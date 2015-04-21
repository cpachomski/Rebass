Template.add_band_member.events({
  'submit #add_member':function(event){

    event.preventDefault();

    var new_member_name = event.target.new_member.value;
    var new_member = Meteor.users.findOne({username: new_member_name});
    var current_band_id = event.target.band.value;

    var current_band = Bands.findOne({_id: current_band_id})


    if (new_member && current_band){
     
      Bands.update({_id: current_band._id}, {$push:{members: new_member._id}})
    
    }

    else{
      console.log("cant find " + new_member_name);
    }

  }

});
