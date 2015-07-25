var DOMParser = require('xmldom').DOMParser;
var fs = require('fs');

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database:'bilibili',
    port: 3306
});
conn.connect();

var cid;

function saveCid(data) {
	
	var ele
	
	var cid,aid,pid
	var suggest_comment
	var maxlimit
	var vtype
	var typeid
	var click
	var favourites
	var credits
	var coins
	var fw_click
	var arctype
	var danmu
	var bottom
	var sinapi
	var acceptguest
	var acceptaccel
	var oriurl
	 
	 data = '<xml>'+data+'</xml>';
	 
	 var doc = new DOMParser().parseFromString(data)
	 
	 
	 try {
		 ele = doc.getElementsByTagName('chatid')[0]
		 
		 if(ele == undefined)
		 {
			 console.log('found file without cid ')
			 throw 'cid is null error'
		 }
		 	
		 
		 cid = ele.textContent
	 } catch (error) {
		 throw error
	 }
	 
	 try {
		 ele = doc.getElementsByTagName('aid')[0]
		 aid = (ele == undefined)?'0':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('pid')[0]
		 pid = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('suggest_comment')[0]
		 suggest_comment = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('maxlimit')[0]
		 maxlimit = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('vtype')[0]
		 vtype = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('typeid')[0]
		 typeid = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('click')[0]
		 click = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('favourites')[0]
		 favourites = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('credits')[0]
		 credits = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('coins')[0]
		 coins = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('fw_click')[0]
		 fw_click = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('arctype')[0]
		 arctype = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('danmu')[0]
		 danmu = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('bottom')[0]
		 bottom = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('sinapi')[0]
		 sinapi = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('acceptguest')[0]
		 acceptguest = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('acceptaccel')[0]
		 acceptaccel = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 try {
		 ele = doc.getElementsByTagName('oriurl')[0]
		 oriurl = (ele == undefined)?'':ele.textContent
	 } catch (error) {}
	 
	 console.log('cid:'+cid)
		 
	 conn.query('INSERT INTO cid SET ?', {
		'cid': cid,
		'aid': aid,
		'pid': pid,
		'suggest_comment': suggest_comment,
		'maxlimit': maxlimit,
		'vtype': vtype,
		'click': click,
		'favourites': favourites,
		'credits': credits,
		'coins': coins,
		'fw_click': fw_click,
		'arctype': arctype,
		'danmu': danmu,
		'bottom': bottom,
		'sinapi': sinapi,
		'acceptguest': acceptguest,
		'acceptaccel': acceptaccel,
		'oriurl': oriurl
		}, function(err, result) {
			if (err && err.errno!=1062) console.log(err);
	});

}

function loadTheCid(Cid){
	var cid = Cid;
	return function(){
		var bucket = Math.floor(cid/10000)
		var path = './data/'+bucket+'/'+cid+'.xml'
		
		if(cid%1000==0)
			console.log(cid);
		
		try{
			var data = fs.readFileSync(path, 'utf8');
			saveCid(data)
		}catch(error){
			fs.appendFileSync('cid-lost-list.txt',cid+'\r\n');
			console.error(error)
			console.error('cid = ' + cid)
		}
	}
};

function loadCid() {
	if(cid>3900000)
		return;
	
	cid++;
	
	setTimeout(loadCid,2);

	setTimeout(loadTheCid(cid),0);

}

function init(){
	cid = 3400000
	fs.writeFileSync('cid-lost-list.txt','');
	loadCid();
};

init();
