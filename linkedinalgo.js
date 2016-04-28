Linkedin scraper
1. go to self profile
2. var count = 0; "https://www.linkedin.com/contacts/api/contacts/more/?start="+count+"&count=10&fields=id%2Cname%2Cfirst_name%2Clast_name%2Ccompany%2Ctitle%2Cgeo_location%2Ctags%2Cemails%2Csources%2Cdisplay_sources%2Clast_interaction%2Csecure_profile_image_url&sort=-last_interaction"
add result on every page;

3. "https://www.linkedin.com/contacts/view?id="+id+"&trk=contacts-contacts-list-contact_name-0"
replace id with contact id

$.ajax({
    type: "GET",
    url: "https://www.linkedin.com/contacts/view?id=47193242&trk=contacts-contacts-list-contact_name-0",
    success: function(data){
        console.log($(data).find('.masthead').first().attr('id').replace('member-', ''));

    }
});

4. load cheerio on reponse and get class="masthead" id (replace 'member-');
use new id:
'https://www.linkedin.com/profile/profile-v2-connections?id='+newid+'&offset='+offset+'&count=10&distance=1&type=INITIAL'

//
var self_name = 'bodhayan'


var t_pre = 'lnk_';

var count = 50;

function mainRecur(){
  $.ajax({
      type: "GET",
      url: "https://www.linkedin.com/contacts/api/contacts/more/?start="+count+"&count=10&fields=id%2Cname%2Cfirst_name%2Clast_name%2Ccompany%2Ctitle%2Cgeo_location%2Ctags%2Cemails%2Csources%2Cdisplay_sources%2Clast_interaction%2Csecure_profile_image_url&sort=-last_interaction&_=1441239538000",
      success: function(data){
        if(!data) return console.log(data, count);
          var arr = [];
          count += data.contacts.length;
          if (data.contacts.length == 0) {
            return console.log('ALL DONE');
          }
          for (var i = 0; i < data.contacts.length; i++) {
            var ob = {};
            ob.name = data.contacts[i].name;
            ob.company = data.contacts[i].company;
            ob.title = data.contacts[i].title;
            ob.email = "";
            ob.location = "";
            for (var j = 0; j < data.contacts[i].emails.length; j++) {
              if(j > 0) ob.email += ',';
              ob.email += data.contacts[i].emails[j].email;
              if(j < data.contacts[i].emails.length-1) ob.email += ',';
            }
            if(data.contacts[i].geo_location) ob.location = data.contacts[i].geo_location.name;
            ob.fid = data.contacts[i].id;
            arr.push(ob);
          }
          $.ajax({
              type: "POST",
              url: "https://localhost:5000/pg",
              data: {'tname': t_pre+self_name+'_cons', arr: arr},
              success: function(){

                  function miniRecur(){
                    if (arr.length > 0) {
                      $.ajax({
                          type: "GET",
                          url: "https://www.linkedin.com/contacts/view?id="+arr[0].fid+"&trk=contacts-contacts-list-contact_name-0",
                          success: function(data){
                            var newid = $(data).find('.masthead').first().attr('id').replace('member-', '');
                            var offset = 0;
                            function microRecur(){
                              $.ajax({
                                  type: "GET",
                                  url: 'https://www.linkedin.com/profile/profile-v2-connections?id='+newid+'&offset='+offset+'&count=10&distance=1&type=INITIAL',
                                  success: function(data){
                                    if (!data.content.connections) {
                                      console.log('breaking mirco');
                                      arr.splice(0, 1);
                                      return miniRecur();
                                    }
                                    if (!data.content.connections.connections) {
                                      console.log('breaking mirco');
                                      arr.splice(0, 1);
                                      return miniRecur();
                                    }
                                    if (data.content.connections.connections.length == 0) {
                                      console.log('breaking mirco');
                                      arr.splice(0, 1);
                                      return miniRecur();
                                    }
                                    var cons = data.content.connections.connections;
                                    offset += cons.length;
                                    var arr2 = [];
                                    for (var i = 0; i < cons.length; i++) {
                                      var ob = {};
                                      ob.name = cons[i].fmt__full_name;
                                      ob.distance = cons[i].distance;
                                      ob.headline = cons[i].headline;
                                      arr2.push(ob);
                                    }
                                    $.ajax({
                                        type: "POST",
                                        url: "https://localhost:5000/pg",
                                        data: {'tname': t_pre+self_name+'_con_'+arr[0].name.trim().replace(/ /g, '_'), arr: arr2},
                                        success: function(){
                                          microRecur();
                                        }
                                    });
                                  }
                              });
                            }
                            microRecur();
                          }
                      });
                    } else {
                      console.log('breaking mini');
                      mainRecur();
                    }
                  }
                  miniRecur();
              }
          });
      }
  });
}
mainRecur();
