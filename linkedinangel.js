var arr = [];
$('div').filter('.base')
.filter('.item').each(function(){
  var ob = {};
  ob.name = $(this).find('.name').text().trim();
  ob.link = $(this).find('.name').find('a').first().attr('href');
  ob.bio = $(this).find('.blurb').text().trim();
  ob.location = $(this).find('.tags').find('a').each(function(i){
    i == 0 ? ob.location = $(this).text().trim() : ob.sector = $(this).text().trim();
  });
  ob.investments = $(this).find('.investments').find('.value').text().trim();
  ob.followers = $(this).find('.followers').find('.value').text().trim();
  arr.push(ob);
});
console.log(arr);

/*


var onlocal = 'https://localhost:5000/savelnk';
var lnk_pre = 'https://www.linkedin.com/profile/profile-v2-connections?id=41297091&offset=';
var lnk_suff = '&count=100&distance=1&type=ALL&_=1440763193892';
var lnk_off = 0;

function recur(){
	console.log(lnk_pre + lnk_off + lnk_suff);
	return setTimeout(function(){
	$.get(lnk_pre + lnk_off + lnk_suff, function(data){
		if (data.content.connections.connections.length > 0) {
			lnk_off += data.content.connections.connections.length;
			$.ajax({
				type: "POST",
				url: onlocal,
				data: {'arr': data.content.connections.connections},
				success: function(data){
					recur();
				}
			});
		} else {
			console.log('done');
		}
	});
	}, 100);
}

recur();

*/
