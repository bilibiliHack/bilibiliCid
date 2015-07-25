var request = require('request');
var fs = require('fs');

var cid = 0;

function downloadCid(cid,trytime) {
	
	console.log('downloading cid:'+cid);
	
	var dirNum = parseInt(cid/10000);
	var dir = './data/'+dirNum+'/';
	var path = './data/'+dirNum+'/'+cid+'.xml';
	
	
	
	request('http://interface.bilibili.com/player?id=cid:'+cid, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('Succeed download cid:'+cid); 
			
			fs.mkdir(dir,function(err, files) {
				if(err&&cid%10000==0){
					console.log('Error:creating dir');
					return;
				}
				
				
				fs.writeFile(path,body,function(err) {
					if(err){
						console.log('Error in opening file '+path);
					}
				});
			});
		}
		else{
			// if(trytime<3){
				console.log('Error:download cid:'+cid+' failed ,tried '+trytime+' times!');
				downloadCid(cid,trytime+1);
			// }
			// else{
			// 	console.error('Error:download cid:'+cid+' failed ,stop trying');
			// }
		}
	});
}

function download() {
	cid +=1;
	
	if(cid%10==0){
		fs.writeFile('./state',cid,function() {})
	}
	
	if(cid>3900000)
		return;
	
	downloadCid(cid,0);
	
	setTimeout(function() {
		download();
	}, 100);
}

function init() {
	fs.readFile('./state',function(err, data) {
		if(err){
			console.log('error in reading state');
			cid=0;
		}else{
			cid=parseInt(data);
			console.log('start at cid:'+cid);
		}
		
		download();
	});
}

init();