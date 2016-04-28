var tname = 'bodhayan_lkdn';
var count = 1700;

function mainRecur(){
  console.log('maincount ', count);
  $.ajax({
      type: "GET",
      url: "https://www.linkedin.com/contacts/api/contacts/more/?start="+count+"&count=10&fields=id%2Cname%2Cfirst_name%2Clast_name%2Ccompany%2Ctitle%2Cgeo_location%2Ctags%2Cemails%2Csources%2Cdisplay_sources%2Clast_interaction%2Csecure_profile_image_url&sort=-last_interaction&_=1441239538000",
      success: function(data){
        if(!data) return console.log(data, count);
        var arr = [];

        count += data.contacts.length;
        if (data.contacts.length == 0) return console.log('ALL DONE');
        var subc = 0;

        function subrecur(){
          console.log('subrecur');
          if (subc < data.contacts.length) {
            var ob = {};
            ob.name = data.contacts[subc].name;
            if(data.contacts[subc].company) ob.company = data.contacts[subc].company.name;
            else console.log('no company');
            ob.email = "";
            for (var j = 0; j < data.contacts[subc].emails.length; j++) {
              if(j > 0) ob.email += ',';
              ob.email += data.contacts[subc].emails[j].email;
              if(j < data.contacts[subc].emails.length-1) ob.email += ',';
            }
            $.ajax({
              type: "GET",
              url: "https://www.linkedin.com/contacts/view?id="+data.contacts[subc].id+"&trk=contacts-contacts-list-contact_name-0",
              success: function(pdata){
                ob = getProfile(ob, pdata);
                arr.push(ob);
                ++subc;
                return subrecur();
              }
            });
          } else {
            return $.ajax({
                type: "POST",
                url: "https://localhost:5000/pg",
                data: {'tname': tname, arr: arr},
                success: function(){
                  console.log('saved');
                  return mainRecur();
                }
            });
          }
        }
        return subrecur();
      }
  });
}

function getProfile(ob, data){
  console.log('getting profile for ', $(data).find('.full-name').text().trim());
  if($(data).find('#headline').text()) ob.title = $(data).find('#headline').text().trim();

  if($(data).find('#location').find('.locality').first().text()) ob.location = $(data).find('#location').find('.locality').first().text().trim();

  if($(data).find('#location').find('.industry').first().text()) ob.industry = $(data).find('#location').find('.industry').first().text().trim();

  if($(data).find('#summary-item-view').text()) ob.summary = $(data).find('#summary-item-view').text().trim();

  ob.experience = [];
  $(data).find('#background-experience').find('div').each(function(){
    if ($(this).attr('id')) {
      if ($(this).attr('id').indexOf('experience-') > -1 && $(this).attr('id').indexOf('view') > -1) {
        var exp = {};
        $(this).find('a').each(function(){
          if($(this).attr('name')){
            if($(this).attr('name').indexOf('title') > -1) {
              exp.title = $(this).text().trim();
              exp.company = $(this).parent().next().text().trim();
            }
          }
        });
        exp.time = $(this).find('.experience-date-locale').first().text().trim().replace($(this).find('.experience-date-locale').first().find('span').text().trim(), '');
        exp.location = $(this).find('.experience-date-locale').first().find('span').text().trim();
        exp.description = $(this).find('.description').first().text().trim();
        ob.experience.push(exp);
      }
    }
  });
  ob.experience = JSON.stringify(ob.experience);
  ob.courses = [];
  $(data).find('#courses-view').find('.section-item').each(function(){
    var course = {};
    course.title = $(this).find('h4').text().trim();
    course.subjects = [];
    $(this).find('li').each(function(){
      course.subjects.push($(this).text().trim());
    });
    ob.courses.push(course);
  });
  ob.courses = JSON.stringify(ob.courses);
  ob.languages = [];
  $(data).find('#languages-view').find('li').each(function(){
    ob.languages.push({
      title: $(this).find('span').first().text().trim(),
      proficiency: $(this).find('div').first().text().trim()
    });
  });
  ob.languages = JSON.stringify(ob.languages);
  ob.projects = [];
  $(data).find('#background-projects').find('div').each(function(){
    if($(this).attr('id')){
      if ($(this).attr('id').indexOf('project-') > -1 && $(this).attr('id').indexOf('view') > -1) {
        ob.projects.push({
          name: $(this).find('span').first().text().trim(),
          time: $(this).find('.projects-date').first().text().trim(),
          description: $(this).find('p').filter('.description').first().text().trim()
        });
      }
    }
  });
  ob.projects = JSON.stringify(ob.projects);
  ob.skills = [];
  $(data).find('#profile-skills').find('li').each(function(){
    if ($(this).find('.endorse-item-name').first().text().trim().length > 0) {
      ob.skills.push({
        name: $(this).find('.endorse-item-name').first().text().trim(),
        upvotes: $(this).find('.num-endorsements').first().text().trim()
      });
    }
  });
  ob.skills = JSON.stringify(ob.skills);
  ob.education = [];
  $(data).find('#background-education').find('div').each(function(){
    if ($(this).attr('id')) {
      if ($(this).attr('id').indexOf('education-') > -1 && $(this).attr('id').indexOf('view') > -1) {
        ob.education.push({
          name: $(this).find('h4').filter('.summary').first().text().trim(),
          degree: $(this).find('.degree').first().text().trim(),
          major: $(this).find('.major').first().text().trim()
        });
      }
    }
  });
  ob.education = JSON.stringify(ob.education);
  return ob;
}
