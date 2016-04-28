function ss(){
  var c = 0;
  $.ajax({
    type: "GET",
    url: "https://socap15.pathable.com/users.json?page=1&per_page=600&order=updated_at&sort_mode=desc&with[ribbon_ids][]=6842",
    success: function(data){

      function recur(){
        if (c < data.results.length) {
          console.log('trying', c, ': ', data.results[c].organization_name);
          console.log("https://www.linkedin.com/vsearch/p?keywords="+ data.results[c].organization_name.replace(/\s+/g,' ').trim().replace(/\s/g, '+'));
          $.ajax({
            type: "GET",
            url: "https://www.linkedin.com/vsearch/p?keywords="+ data.results[c].organization_name.replace(/\s+/g,' ').trim().replace(/\s/g, '+'),
            success: function(sdata){



              return console.log($(sdata).find('#results').text());



              var f = $(sdata).find('.search-results').first().find('.description').first().text();
              var deg = $(sdata).find('.search-results').first().find('.degree-icon').first().text();
              console.log(f, deg);
              var link = $(sdata).find('.search-results').first().find('.main-headline').first().attr('href');
              if (f) {
                if (f.toLowerCase().indexOf(data.results[c].organization_name) > -1) {
                  console.log('saving ', link);
                  $.ajax({
                      type: "POST",
                      url: "https://localhost:5001/mongo",
                      data: {cname: 'rohitlink', data: [{name: data.results[c].organization_name, degree: deg, link: link}]},
                      success: function(){
                      }
                  });
                }
              }
              ++c;
              console.log('setting');
              setTimeout(function(){
                console.log('called');
                recur();
              }, 4000);
            }
          });
        } else {
          console.log('\\^/ fin \\^/');
        }
      }
      recur();
    }
  });
}



function s(){
  var idc = 0;
  var ids = [
    {
      name: 'sandeep2',
      id: "89896",
      start: 530
    },
    {
      name: "anuj",
      id: "715884",
      start: 0
    }
  ];



  function recurMain(){
    if (idc < ids.length) {
      var count = ids[idc].start;

      function recur(){
        $.ajax({
          type: "GET",
          url: "https://www.linkedin.com/profile/profile-v2-connections?id="+ids[idc].id+"&offset="+count+"&count=10&distance=1&type=INITIAL",
          success: function(data){
            if (data.content.connections.connections) {
              var cons = data.content.connections.connections;
              count += cons.length;
              var rc = 0;
              function subrec(){
                if (rc < cons.length) {
                  $.ajax({
                    type: "GET",
                    url: cons[rc].pview,
                    success: function(data){
                      var l = locfromdat(data);
                      if (l) {
                        cons[rc].geo_location = {
                          name: l
                        };
                      }
                      ++rc;
                      setTimeout(function(){
                        subrec();
                      }, 4000);
                    }
                  });
                } else {
                  $.ajax({
                      type: "POST",
                      url: "https://localhost:5001/mongo",
                      data: {cname: ids[idc].name, data: cons},
                      success: function(){
                        console.log('saved', ids[idc].name, count);
                        return recur();
                      }
                  });
                }
              }
              return subrec();
            } else {
              ++idc;
              return recurMain();
            }
          }
        });
      }
      return recur();
    } else {
      console.log('\ \ \٩(๑˃̵ᴗ˂̵)و/ / /');
    }
  }
  recurMain();
}

function locfromdat(data){
  if($(data).find('#location').find('.locality').first().text()) return $(data).find('#location').find('.locality').first().text().trim();
  return;
}


function save(){

  var cname = 'akash1stdegree';
  var count = 0;

  function myConRecur(){
    $.ajax({
      type: "GET",
      url: "https://www.linkedin.com/contacts/api/contacts/more/?start="+count+"&count=10&fields=id%2Cname%2Cfirst_name%2Clast_name%2Ccompany%2Ctitle%2Cgeo_location%2Ctags%2Cemails%2Csources%2Cdisplay_sources%2Clast_interaction%2Csecure_profile_image_url&sort=-last_interaction&_=",
      success: function(data){
        if(!data) {
          return console.log('1');
        }
        if(!data.status) {
          return console.log('2');
        }
        if (data.status == "error") {
          return console.log(data);
        }
        count += data.contacts.length;
        if (data.contacts.length == 0) return console.log('ALL DONE');
        if (data.status == "success") {
          $.ajax({
              type: "POST",
              url: "https://localhost:5001/mongo",
              data: {cname: cname, data: data.contacts},
              success: function(){
                console.log('saved');
                return setTimeout(function(){
                  myConRecur();
                }, 300);
              }
          });
        }
        console.log('wtf');
      }
    });
  }
  return myConRecur();
}
