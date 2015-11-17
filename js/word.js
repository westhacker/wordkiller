var word;
var id;
var wordtype;
var mean;
var num;
var ans;
var ansa,ansb,ansc,answer;
var right=0,wrong=0;
var pause=0;
var numQ=0,numR=0,numP=0
var namedict="data/tef7392.xml",numdict=7392,iddict=1;
var xmlDoc;
var matchwords = new Array();
matchwords["id"]=new Array();
matchwords["word"]=new Array();
matchwords["wordtype"]=new Array();
matchwords["mean"]=new Array();
matchwords["result"]=new Array();
var matchNumber=10;
var currentIndex=0;
var db;
var lengthInput=0;
var uid = fRandomBy(10000000,99999999);
//var idid=0;

var native_random = Math.random;
Math.random = function(min, max, exact) {
    if (arguments.length === 0)
    {
        return native_random();
    }
    else if (arguments.length === 1)
    { max = min; min = 0; }
    var range = min + (native_random()*(max - min));
    return exact === void(0) ? Math.round(range) : range.toFixed(exact);
};


function initword()
{
	initpro();
	if(numQ==0)oldid();
	else randomid();
}

function sync(){
	opendb()
	DBSYNC.initSync([{tableName : 'test_table', idName : 'id'}], db, "test", 'http://localhost/wordkiller/sync/index.php', callBackEndInit);
	DBSYNC.syncNow(callBackSyncProgress, function(result) {
     if (result.syncOK === true) {
         //Synchronized successfully
         //decode result

         //insert in websql
         
         alert("Synchronized successfully")
     }
});
}

function callBackEndInit(){
	
}

function callBackSyncProgress(){

}

function opendb(){
	try {
	    if (!window.openDatabase) {
	        alert('not supported');
		} else {
		    var shortName = 'mydatabase';
		    var version = '1.0';
		    var displayName = 'My Important Database';
		    var maxSize = 5*1024*1024; // in bytes
		    db = openDatabase(shortName, version, displayName, maxSize);
		        // You should have a database instance in db.    
		    }
	} catch(e) {
	    // Error handling code goes here.
	    if (e == 2) {
	        // Version number mismatch.
	        alert("Invalid database version.");
	    } else {
	        alert("Unknown error "+e+".");
	    }
    return;
	}
    
	//alert("Database is: "+db);
}

function writesql(){
	opendb();
	db.transaction(function(tx){
		//tx.executeSql('DROP TABLE test_table');
		tx.executeSql("CREATE TABLE IF NOT EXISTS test_table (id INTEGER NOT NULL PRIMARY KEY, num_wrong integer, num_right integer, modify_time TIMESTAMP DEFAULT (datetime('now','localtime')));");
		tx.executeSql('SELECT * FROM test_table WHERE id=?',[(100000*iddict+id)*1],function(tx,res){
			if(res.rows.length==0){
				//alert(wrong+"&"+right)
				tx.executeSql("INSERT INTO test_table (id, num_wrong, num_right,modify_time) VALUES (?,?,?,datetime('now', 'localtime'))",[(100000*iddict+id)*1,wrong*1,right*1]);
				//alert("insert");
			}else{
				//alert(wrong+"&"+right)
				tx.executeSql("UPDATE test_table SET num_wrong=?,num_right=?,modify_time=datetime('now', 'localtime') WHERE id=?",[wrong*1,right*1,(100000*iddict+id)*1]);
				//alert("update")
			}
		});		
	},function(e){
		alert("Error:"+e.message);
	});
}



function readsql(){
	opendb();
	db.transaction(function(tx){
		tx.executeSql("CREATE TABLE IF NOT EXISTS test_table (id INTEGER NOT NULL PRIMARY KEY, num_wrong integer, num_right integer, modify_time TIMESTAMP DEFAULT (datetime('now','localtime')));");
		tx.executeSql('SELECT * FROM test_table WHERE id=?',[(100000*iddict+id)*1],function(tx,res){
			if(res.rows.length==0){
				wrong=0;
				right=0;
			}else{
				var row = res.rows.item(0);
				//alert(row['num_wrong'])
				wrong = row['num_wrong']*1;
				right = row['num_right']*1;
			}
			document.getElementById("score").innerHTML="认知系数："+(right-2*wrong)*1;
		});
	},function(e){
		alert("Error:"+e.message);
	});
}
/*
function encode(){
	idid=100000*iddict+id;
}

function decode(){
	id=idid%100000;
	iddict=int(idid/100000);
}
*/

function initclassic()
{
	rien()
	initword();
	document.getElementById("maincontent").style.display="block";
	document.getElementById("pass").style.display="none";
	document.getElementById("easy").style.display="block";
	document.getElementById("pause").style.display="block";
	document.getElementById("numQuestion").style.display="none";
	document.getElementById("numRight").style.display="none";
	$('#maincontent').addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated bounceInDown');
    });
}

function rien()
{
	document.getElementById("select").style.display="none";
	document.getElementById("msg").style.display="none";
	document.getElementById("welcome").style.display="none";
	document.getElementById("maincontent").style.display="none";
	document.getElementById("record").style.display="none";
	document.getElementById("search").style.display="none";
	pause=1;
	document.getElementById("pause").className="icon fa-play fa"
}

function startmatch()
{
	rien()
	numR=0;
	numP=0;
	initword();
	document.getElementById("maincontent").style.display="block"
	document.getElementById("easy").style.display="none";
	document.getElementById("pass").style.display="block";
	document.getElementById("pause").style.display="none";
	document.getElementById("numQuestion").style.display="block";
	document.getElementById("numRight").style.display="block";
	document.getElementById("numQuestion").innerHTML=numQ+"/"+matchNumber;
	document.getElementById("numRight").innerHTML=numR+"/"+numQ;
	$('#maincontent').addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated bounceInDown');
    });
}

function initmatch()
{
	rien()
	document.getElementById("msg").style.display="block"
	document.getElementById("msgtitle").className="icon fa-flag-checkered fa-4x"
	document.getElementById("msgtitle").innerHTML="&nbsp;&nbsp;竞技模式"
	document.getElementById("msgcontent").innerHTML="竞技模式中，你将在"+matchNumber/5+"分钟内连续回答"+matchNumber+"个问题，答对加3分，答错扣1分，Pass不加分不扣分，请点击下面按钮开始答题"
	document.getElementById("msgbutton").innerHTML="开始答题"
	document.getElementById("msgbutton").onclick=function(){startmatch()};
	$('#msg').addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated bounceInDown');
    });
}

function initpvp()
{
	rien()
	huntPVP()
	document.getElementById("msg").style.display="block"
	document.getElementById("msgtitle").className="icon fa-joomla fa-4x"
	document.getElementById("msgtitle").innerHTML="&nbsp;&nbsp;对战模式"
	document.getElementById("msgcontent").innerHTML="对战模式中，你将与你的好友一决高下，每一题都同时出现，双方进行抢答，在"+matchNumber/5+"分钟内连续回答"+matchNumber+"个问题，答对加3分，答错扣1分，不答不加分不扣分，请选择好友后点击下面按钮准备对战"
	document.getElementById("msgbutton").innerHTML="准备对战"
	document.getElementById("msgbutton").onclick=function(){
		document.getElementById("msgbutton").innerHTML="等待对方应战..."
		startPVP();
		};
	$('#msg').addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated bounceInDown');
    });
}

function finishmatch()
{
	rien()

	document.getElementById("msg").style.display="block"
	document.getElementById("msgtitle").className="icon fa-flag-checkered fa-4x"
	document.getElementById("msgtitle").innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;竞技模式"
	document.getElementById("msgcontent").innerHTML="你本次竞技模式的得分为：<table><tr><td>总分</td><td>"+(numR*3-matchNumber+numR+numP)*1+"/"+matchNumber*3+"</td></tr><tr><td>答对</td><td>"+numR+"</td><tr><td>答错</td><td>"+(matchNumber-numR-numP)*1+"</td></tr><tr><td>未答</td><td>"+numP+"</td></tr></table>";
	pause=1;
	document.getElementById("msgbutton").innerHTML= "查看答题记录"
	document.getElementById("msgbutton").onclick=function(){showrecords()};
	$('#msg').addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated bounceInDown');
    });
}

function showrecords()
{
	rien()
	document.getElementById("msg").style.display="block"
	document.getElementById("msgtitle").className="icon fa-flag-checkered fa-4x"
	document.getElementById("msgtitle").innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;答题记录"
	var t="<table>";
	//document.getElementById("msg").style.overflow="auto";

		for(i=0;i<30;i++){
		 	//id=matchwords["id"][i];
			word=matchwords["word"][i];
			wordtype=matchwords["wordtype"][i];
			mean=matchwords["mean"][i];
		    if(matchwords["result"][i]==-1)
	t+="<tr><td><i class='fa fa-times'></i>&nbsp;&nbsp;"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
	if(matchwords["result"][i]==0)
	t+="<tr><td><i class='fa fa-arrow-circle-o-right'></i>&nbsp;&nbsp;"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
	if(matchwords["result"][i]==1)
	t+="<tr><td><i class='fa fa-check-square-o'></i>&nbsp;&nbsp;"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
			
		}
	document.getElementById("msgcontent").innerHTML=t+"</table>";
	if(numR==matchNumber){
		document.getElementById("msgbutton").innerHTML= "光荣退出竞技场"
	    document.getElementById("msgbutton").onclick=function(){welcome()};
	}else{
		document.getElementById("msgbutton").innerHTML= "复习错词"
		document.getElementById("msgbutton").onclick=function(){review()};
    }

	$('#msg').addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated bounceInDown');
    });
}

function review()
{
	rien()
	currentIndex=0;
	var matchNumber=10;
	initpro();
	wrongid();
	document.getElementById("maincontent").style.display="block";
	document.getElementById("pass").style.display="none";
	document.getElementById("easy").style.display="block";
	document.getElementById("pause").style.display="block";
	document.getElementById("numQuestion").style.display="none";
	document.getElementById("numRight").style.display="none";
	$('#maincontent').addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated bounceInDown');
    });
}

function finishreview()
{
	rien()
	document.getElementById("msg").style.display="block"
	document.getElementById("msgtitle").className="icon fa-flag-checkered fa-4x"
	document.getElementById("msgtitle").innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;复习完成"
	document.getElementById("msgcontent").innerHTML="恭喜你已经完成了所有的错题复习,再接再厉！↖(^ω^)↗";
	numQ=0;
	numR=0;
	currentIndex=0;
	pause=1;
	document.getElementById("msgbutton").innerHTML= "返回主界面"
	document.getElementById("msgbutton").onclick=function(){welcome()};
	$('#msg').addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated bounceInDown');
    });
}

function welcome()
{
	$('#home').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated zoomIn');
    });
	rien()
	document.getElementById("welcome").style.display="block";
}

function checkans()
{
    if(ans==num){
        //document.getElementById("ans"+ans).innerHTML="么么哒!";
        //document.getElementById("ans"+ans).style.color = "#009100";
        document.getElementById("wordtype").innerHTML=wordtype;
		document.getElementById("sound").src="wav/right.wav";
		document.getElementById("sound").play();	
		right++;
		score();
		rightAnim('#ans'+ans);
		if(matchNumber==1){
			var t=setTimeout("initsearch()",50);
			matchNumber=10;
			return false;
		}
		if(numQ==0){	
		//continue classic
        var t=setTimeout("initword()",50);}
		else if(numQ<matchNumber){
			//continue match
			matchwords["id"][numQ]=id;
			matchwords["word"][numQ]=word;
			matchwords["wordtype"][numQ]=wordtype;
			matchwords["mean"][numQ]=mean;
			matchwords["result"][numQ]=1;
			numR++;
			var t=setTimeout("initword()",50);
			}else if(currentIndex==0){
				//finish match
				numR++;
				matchwords["id"][numQ]=id;
			matchwords["word"][numQ]=word;
			matchwords["wordtype"][numQ]=wordtype;
			matchwords["mean"][numQ]=mean;
			matchwords["result"][numQ]=1;
				finishmatch()
			}else if(currentIndex<=matchNumber){
				//continue review
				initpro();
				var t=setTimeout("wrongid()",50);
			}else{
				//finish review
				var t=setTimeout("finishreview()",50);
			}
			
		}
    else{
        //document.getElementById("ans"+ans).innerHTML="再接再厉";
		document.getElementById("sound").src="wav/wrong.mp3";
		document.getElementById("sound").play();	
		wrong++;
		score();
		wrongAnim('#ans'+ans);
		if(numQ==0){
			//continue classic
			var t=setTimeout("changeans()",50);
			}
			else if(numQ<matchNumber){
				//continue match
				matchwords["id"][numQ]=id;
				matchwords["word"][numQ]=word;
				matchwords["wordtype"][numQ]=wordtype;
				matchwords["mean"][numQ]=mean;
				matchwords["result"][numQ]=-1;
				var t=setTimeout("initword()",50);
				}
			else if(currentIndex==0){
				//finish match
				matchwords["id"][numQ]=id;
				matchwords["word"][numQ]=word;
				matchwords["wordtype"][numQ]=wordtype;
				matchwords["mean"][numQ]=mean;
				matchwords["result"][numQ]=-1;
				var t=setTimeout("finishmatch()",50);
			}else{
				var t=setTimeout("changeans()",50);
			}
    }

	if(numQ>0){
			numQ++;
			document.getElementById("numQuestion").innerHTML=numQ+"/"+matchNumber;
			document.getElementById("numRight").innerHTML=numR+"/"+(numQ-1)*1;
			}
}

function changeans()
{
    newnum=Math.random(0,3);
    document.getElementById("ans"+newnum).innerHTML=answer;
    document.getElementById("ans"+(newnum+1)%4).innerHTML=ansa;
    document.getElementById("ans"+(newnum+2)%4).innerHTML=ansb;
    document.getElementById("ans"+(newnum+3)%4).innerHTML=ansc;
    num=newnum;
	initpro();
}

function easy()
{
	$('#easy').addClass('animated zoomOutUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated zoomOutUp');
    });

    if(wrong==0){ right += 10 }
    else {wrong=0;}
    score();
	document.getElementById("sound").src="wav/easy.mp3";
		document.getElementById("sound").play();	
	if(pause==1)pausePlay();
	
	if(matchNumber==1){
			var t=setTimeout("initsearch()",50);
			matchNumber=10;
			return false;
		}

	if(currentIndex==0){
		//classic
		var t=setTimeout("initword()",50);
	}else if(currentIndex<=matchNumber){
		//review
		var t=setTimeout("wrongid()",50);
		initpro();
	}else{
		var t=setTimeout("finishreview()",50);
	}
}

function pass()
{
    wrong++;
	numP++;
	score();
	
    if(numQ<matchNumber){
    	//continue match
		numQ++;
		document.getElementById("numQuestion").innerHTML=numQ+"/"+matchNumber;
			matchwords["id"][numQ-1]=id;
			matchwords["word"][numQ-1]=word;
			matchwords["wordtype"][numQ-1]=wordtype;
			matchwords["mean"][numQ-1]=mean;
			matchwords["result"][numQ-1]=0;
		var t=setTimeout("initword()",50);
		}
	else if(currentIndex==0){
		matchwords["id"][numQ]=id;
			matchwords["word"][numQ]=word;
			matchwords["wordtype"][numQ]=wordtype;
			matchwords["mean"][numQ]=mean;
			matchwords["result"][numQ]=0;
		finishmatch()
	}
}

/*
function score(){
	var storedScores = JSON.parse(localStorage["scores"+iddict]);
	scores[id]=storedScores[id]*1
	if(scores[id]==null){scores[id]=0;}
	scores[id] = scores[id]+right-2*wrong;
	//alert(scores)
	localStorage.setItem("scores"+iddict,JSON.stringify(scores));
	document.getElementById("score").innerHTML="认知系数："+scores[id]*1;
	writesql();
	//test localstorage
	var storedScores = JSON.parse(localStorage["scores"+iddict]);
	for(var i=0;i<numdict;i++){
	if(storedScores[i]!=null)
	alert(storedScores[i])}
}

function newid()
{
	id=Math.random(1,numdict);
        if(!localStorage["scores"+iddict]) {localStorage["scores"+iddict] = JSON.stringify(scores);}
	var storedScores = JSON.parse(localStorage["scores"+iddict]);
	if(storedScores[id]*1>Math.random(-5,5)){
		newid()
		}
		else {document.getElementById("score").innerHTML="认知系数："+storedScores[id]*1;return}
}
*/

function score(){
	//document.getElementById("score").innerHTML="认知系数："+(right-2*wrong)*1;
	//alert(wrong)
	writesql();
	readsql();
}


function fRandomBy(under, over){

switch(arguments.length){

case 1: return parseInt(Math.random()*under+1);

case 2: return parseInt(Math.random()*(over-under+1) + under);

default: return 0;

}

}

function randomid()
{
	//id=Math.random(1,numdict);
	id=fRandomBy(1,numdict);
	
	opendb();
	db.transaction(function(tx){
		tx.executeSql("CREATE TABLE IF NOT EXISTS test_table (id INTEGER NOT NULL PRIMARY KEY, num_wrong integer, num_right integer, modify_time TIMESTAMP DEFAULT (datetime('now','localtime')));");
		tx.executeSql('SELECT * FROM test_table WHERE id=?',[(100000*iddict+id)*1],function(tx,res){
			
			if(res.rows.length==0){
				wrong = 0;
				right = 0;
			}else{
				var row = res.rows.item(0);
				wrong = row['num_wrong']*1;
				right = row['num_right']*1;
			}
	document.getElementById("score").innerHTML="认知系数："+(right-2*wrong)*1;
	pause=0;
	document.getElementById("pause").className="icon fa-pause fa";
  
    $.ajax({
	type:"GET",
	url:namedict,
	dataType:"xml",
	error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown);
		},
	success: function(xml){
		 //alert($(xml).find('id').eq(id));
		 word=$(xml).find('id').eq(id).parent().find('word').text();
		 wordtype=$(xml).find('id').eq(id).parent().find('type').text();
		 mean=$(xml).find('id').eq(id).parent().find('mean').text();
	
	tips()
	document.getElementById("wordtype").innerHTML=wordtype;
	num=Math.random(0,3);
	switch(num%2){
	case 0:
	document.getElementById("keyword").innerHTML=word;
	document.getElementById("ans"+num).innerHTML=mean;
	answer=mean;
    //to do: a,b,c may be the same
	ansa=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	ansb=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	ansc=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	break;
	case 1:
	document.getElementById("keyword").innerHTML=mean;
	document.getElementById("ans"+num).innerHTML=word;
	answer=word;
	//to do: a,b,c may be the same
	ansa=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	ansb=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	ansc=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	break;
	default:break;
	}
	document.getElementById("ans"+(num+1)%4).innerHTML=ansa;
    document.getElementById("ans"+(num+2)%4).innerHTML=ansb;
    document.getElementById("ans"+(num+3)%4).innerHTML=ansc;
}
});
			
		});
	},function(e){
		alert("Error:"+e.message);
	});
}

function wrongid()
{
	for(i=currentIndex;i<=matchNumber+1;i++){
		currentIndex=i;
		if(matchwords["result"][i]!=1&&matchwords["result"][i]!=null){
			break;
		}
	}

	id=matchwords["id"][currentIndex];
	word=matchwords["word"][currentIndex];
	wordtype=matchwords["wordtype"][currentIndex];
	mean=matchwords["mean"][currentIndex];

	//find next wrongid
	currentIndex++;
	for(i=currentIndex;i<=matchNumber+1;i++){
		currentIndex=i;
		if(matchwords["result"][i]!=1&&matchwords["result"][i]!=null){
			break;
		}
	}

	
	tips();
	document.getElementById("wordtype").innerHTML=wordtype;
	opendb();
	db.transaction(function(tx){
		tx.executeSql("CREATE TABLE IF NOT EXISTS test_table (id INTEGER NOT NULL PRIMARY KEY, num_wrong integer, num_right integer, modify_time TIMESTAMP DEFAULT (datetime('now','localtime')));");
		tx.executeSql('SELECT * FROM test_table WHERE id=?',[(100000*iddict+id)*1],function(tx,res){
			if(res.rows.length==0){
				wrong = 0;
				right = 0;
			}else{
			    var row = res.rows.item(0);
			    //alert(row['num_wrong'])
				wrong = row['num_wrong']*1;
				right = row['num_right']*1;
			}
	document.getElementById("score").innerHTML="认知系数："+(right-2*wrong)*1;
	pause=0;
	document.getElementById("pause").className="icon fa-pause fa";
	
	
	 
	$.ajax({
	type:"GET",
	url:namedict,
	dataType:"xml",
	error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown);
		},
	success: function(xml){
	num=Math.random(0,3);
	switch(num%2){
	case 0:
	document.getElementById("keyword").innerHTML=word;
	document.getElementById("ans"+num).innerHTML=mean;
	answer=mean;
    //to do: a,b,c may be the same
	ansa=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	ansb=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	ansc=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	break;
	case 1:
	document.getElementById("keyword").innerHTML=mean;
	document.getElementById("ans"+num).innerHTML=word;
	answer=word;
	//to do: a,b,c may be the same
	ansa=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	ansb=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	ansc=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	break;
	default:break;
	}
	document.getElementById("ans"+(num+1)%4).innerHTML=ansa;
    document.getElementById("ans"+(num+2)%4).innerHTML=ansb;
    document.getElementById("ans"+(num+3)%4).innerHTML=ansc;
}
});
			
		});
	},function(e){
		alert("Error:"+e.message);
	});
}

function newid()
{
	//id=Math.random(1,numdict);
	id=fRandomBy(1,numdict);
	opendb();
	db.transaction(function(tx){
		//tx.executeSql('DROP TABLE test_table');
		tx.executeSql("CREATE TABLE IF NOT EXISTS test_table (id INTEGER NOT NULL PRIMARY KEY, num_wrong integer, num_right integer, modify_time TIMESTAMP DEFAULT (datetime('now','localtime')));");
		tx.executeSql('SELECT * FROM test_table WHERE id=?',[(100000*iddict+id)*1],function(tx,res){
			if(res.rows.length>0)newid();
			else{
				wrong = 0;
				right = 0;
				document.getElementById("score").innerHTML="认知系数："+(right-2*wrong)*1;
				pause=0;
	document.getElementById("pause").className="icon fa-pause fa";
  
    $.ajax({
	type:"GET",
	url:namedict,
	dataType:"xml",
	error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown);
		},
	success: function(xml){
		 //alert($(xml).find('id').eq(id));
		 word=$(xml).find('id').eq(id).parent().find('word').text();
		 wordtype=$(xml).find('id').eq(id).parent().find('type').text();
		 mean=$(xml).find('id').eq(id).parent().find('mean').text();
	
	tips()
	document.getElementById("wordtype").innerHTML=wordtype;
	num=Math.random(0,3);
	switch(num%2){
	case 0:
	document.getElementById("keyword").innerHTML=word;
	document.getElementById("ans"+num).innerHTML=mean;
	answer=mean;
    //to do: a,b,c may be the same
	ansa=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	ansb=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	ansc=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	break;
	case 1:
	document.getElementById("keyword").innerHTML=mean;
	document.getElementById("ans"+num).innerHTML=word;
	answer=word;
	//to do: a,b,c may be the same
	ansa=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	ansb=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	ansc=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	break;
	default:break;
	}
	document.getElementById("ans"+(num+1)%4).innerHTML=ansa;
    document.getElementById("ans"+(num+2)%4).innerHTML=ansb;
    document.getElementById("ans"+(num+3)%4).innerHTML=ansc;
}
});
				return
			}
			
		});
	},function(e){
		alert("Error:"+e.message);
	});
}

function oldid(){
	opendb();
	db.transaction(function(tx){
		//tx.executeSql('DROP TABLE test_table');
		tx.executeSql("CREATE TABLE IF NOT EXISTS test_table (id INTEGER NOT NULL PRIMARY KEY, num_wrong integer, num_right integer, modify_time TIMESTAMP DEFAULT (datetime('now','localtime')));");
		tx.executeSql('SELECT * FROM test_table WHERE id<? AND id>? AND num_right-num_wrong*2<?',[100000*(iddict+1),100000*(iddict-1),10],function(tx,res){
			if(res.rows.length<30)newid();
			else{
				//if(res.rows.length==0)finishdict()
				var i = fRandomBy(0,res.rows.length);
			    var row = res.rows.item(i);
				id = row['id']%100000;
				wrong = row['num_wrong']*1;
				right = row['num_right']*1;
				document.getElementById("score").innerHTML="认知系数："+(right-2*wrong)*1;
				pause=0;
	document.getElementById("pause").className="icon fa-pause fa";
  
    $.ajax({
	type:"GET",
	url:namedict,
	dataType:"xml",
	error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown);
		},
	success: function(xml){
		 //alert($(xml).find('id').eq(id));
		 word=$(xml).find('id').eq(id).parent().find('word').text();
		 wordtype=$(xml).find('id').eq(id).parent().find('type').text();
		 mean=$(xml).find('id').eq(id).parent().find('mean').text();
	
	tips()
	document.getElementById("wordtype").innerHTML=wordtype;
	num=Math.random(0,3);
	switch(num%2){
	case 0:
	document.getElementById("keyword").innerHTML=word;
	document.getElementById("ans"+num).innerHTML=mean;
	answer=mean;
    //to do: a,b,c may be the same
	ansa=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	ansb=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	ansc=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	break;
	case 1:
	document.getElementById("keyword").innerHTML=mean;
	document.getElementById("ans"+num).innerHTML=word;
	answer=word;
	//to do: a,b,c may be the same
	ansa=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	ansb=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	ansc=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	break;
	default:break;
	}
	document.getElementById("ans"+(num+1)%4).innerHTML=ansa;
    document.getElementById("ans"+(num+2)%4).innerHTML=ansb;
    document.getElementById("ans"+(num+3)%4).innerHTML=ansc;
}
});
			}
		});
	},function(e){
		alert("Error:"+e.message);
	});
}

function mute()
{
	if(document.getElementById("sound").muted){
	document.getElementById("sound").muted=false;
	document.getElementById("mute").innerHTML="";
	document.getElementById("mute").className="icon alt fa-volume-up"
	}
	else{
	document.getElementById("sound").muted=true;
	document.getElementById("mute").innerHTML=""
	document.getElementById("mute").className="icon alt fa-volume-off"
	}
}

function pausePlay()
{
	if(pause==0){
	pause=1;
	document.getElementById("pause").className="icon fa-play fa"
	}
	else{
		pause=0;
		addValue()
	document.getElementById("pause").className="icon fa-pause fa"
	}
}

function tips()
{
	if(numQ==0){
	switch(Math.random(0,4)){
		case 0:
	document.getElementById("tips").innerHTML="Tip:这词太熟了！果断点击上面的小火箭甩掉它";break;
	case 1:
	document.getElementById("tips").innerHTML="Tip:竞技模式看水平，你说不定已经超神了呢";break;
	case 2:
	document.getElementById("tips").innerHTML="Tip:想缓口气了，那就点击上面的暂停按钮";break;
	case 3:
	document.getElementById("tips").innerHTML="Tip:认知系数是对单词的熟悉度，越熟见面越少";break;
	case 4:
	document.getElementById("tips").innerHTML="Tip:点击左上当前词库，就可以查看学习记录喽";break;
	default:break;
	}
	}
	else{
		switch(Math.random(0,4)){
		case 0:
	document.getElementById("tips").innerHTML="Tip:不会也不要逞强，先去经典模式练手";break;
	case 1:
	document.getElementById("tips").innerHTML="Tip:竞技模式下木有暂停哦，一鼓作气吧";break;
	case 2:
	document.getElementById("tips").innerHTML="Tip:竞技模式下得高分可以上榜哦";break;
	case 3:
	document.getElementById("tips").innerHTML="Tip:竞技模式答题也会对认知系数产生影响";break;
	case 4:
	document.getElementById("tips").innerHTML="Tip:竞技模式是否会加入对战功能呢？？？";break;
	default:break;
	}
	}
}

function selectdict()
{
	$('#dict').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated zoomIn');
    });
	rien()
	document.getElementById("select").style.display="block"
}

function decidedict()
{
	document.getElementById("select").style.display="none"
	
	if(iddict==0){namedict="data/basic767.xml";numdict=767;
	document.getElementById("topbtn").innerHTML="当前词库：法语基础767词";
	}
	if(iddict==1){namedict="data/tef7392.xml";numdict=7392;
	document.getElementById("topbtn").innerHTML="当前词库：TEF考试7392词";
	}
	if(iddict==2){namedict="data/german775.xml";numdict=775;
	document.getElementById("topbtn").innerHTML="当前词库：德语基础775词";
	}
	
	if(numQ==0){initword();document.getElementById("maincontent").style.display="block";
	$('#maincontent').addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated bounceInDown');
    });}
	else initmatch();
	
}

function showdictrecord()
{
	opendb();
	db.transaction(function(tx){
	
		/*tx.executeSql("DROP TABLE test_table",[], 
		    function(tx,results){console.log("Successfully Dropped")},
		    function(tx,error){console.log("Could not delete")}
		);*/
		tx.executeSql("CREATE TABLE IF NOT EXISTS test_table (id INTEGER NOT NULL PRIMARY KEY, num_wrong integer, num_right integer, modify_time TIMESTAMP DEFAULT (datetime('now','localtime')));");
       tx.executeSql('SELECT * FROM test_table WHERE id<? AND id>? ORDER BY modify_time desc',[100000*(iddict+1),100000*(iddict-1)],function(tx,res){

    $.ajax({
	type:"GET",
	url:namedict,
	dataType:"xml",
	error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown);
		},
	success: function(xml){  
		//alert(res.rows.length)
		var t="<table>";
	//document.getElementById("msg").style.overflow="auto";

	
		for(i=0;i<res.rows.length;i++)
			{
				//if(res.rows.length==0)finishdict()
			    var row = res.rows.item(i);

				id = row['id']%100000; 
				wrong = row['num_wrong']*1;
				right = row['num_right']*1;

		 //alert($(xml).find('id').eq(id));
		 word=$(xml).find('id').eq(id).parent().find('word').text();
		 wordtype=$(xml).find('id').eq(id).parent().find('type').text();
		 mean=$(xml).find('id').eq(id).parent().find('mean').text();
        if((right-2*wrong)*1<10)
	    t+="<tr><td><i class='fa fa-spinner fa-spin'></i></i>&nbsp;&nbsp;"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
		else t+="<tr><td><i class='fa fa-thumbs-up'></i>&nbsp;&nbsp;"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
		}
		document.getElementById("recordcontent").innerHTML=t+"</table>";
	$('#record').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated zoomIn');
    });
	rien()
	document.getElementById("record").style.display="block"
}
});
			
	},function(e){
		alert("Error:"+e.message);
	}); 
		
});

}


function initsearch()
{
	rien();
	document.getElementById("search").style.display="block";

	$('#find').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated zoomIn');
    });
}

function dosearch()
{
	var input=new String(document.getElementById("searchword").value);
	
	$.ajax({
	type:"GET",
	url:namedict,
	dataType:"xml",
	error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown);
		},
	success: function(xml){  
		var t="<table>";
		var tt="";
		var ttt="";
	
		 	$(xml).find('word').each(function(){
				
                var xmlword = new String($(this).text());
				if(getstr(xmlword).search(getstr(input))!=-1){
					
					word=$(this).text();
					wordtype=$(this).parent().find('type').text();
					mean=$(this).parent().find('mean').text();
					id=$(this).parent().find('id').text();
					matchwords["id"][1]=id;
					matchwords["word"][1]=word;
					matchwords["wordtype"][1]=wordtype;
					matchwords["mean"][1]=mean;
					matchwords["result"][1]=0;
					if(getstr(xmlword).indexOf(getstr(input))==0){
						if(getstr(xmlword).length==getstr(input).length){
							numSearchResult++;
							t+="<tr onclick='oneword("+id+")'><td>"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
						}
						else tt+="<tr onclick='oneword("+id+")'><td>"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
					}else ttt+="<tr onclick='oneword("+id+")'><td>"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
				}
            });
			
			$(xml).find('mean').each(function(){
                var xmlword = new String($(this).text());
				if(getstr(xmlword).search(getstr(input))!=-1){
					numSearchResult++;
					mean=$(this).text();
					wordtype=$(this).parent().find('type').text();
					word=$(this).parent().find('word').text();
					id=$(this).parent().find('id').text();
					matchwords["id"][1]=id;
					matchwords["word"][1]=word;
					matchwords["wordtype"][1]=wordtype;
					matchwords["mean"][1]=mean;
					matchwords["result"][1]=0;
					t+="<tr onclick='oneword("+id+")'><td>"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
				}
            });
		 
	document.getElementById("searchcontent").innerHTML=t+tt+ttt+"</table>";
}
});
	//alert(word.length)
}

function hint()
{
	var input=new String(document.getElementById("searchword").value);
	if(input.length<=lengthInput){
		lengthInput=input.length;
		document.getElementById("searchcontent").innerHTML='';
		return false;
	}
	
	lengthInput=input.length;
	$.ajax({
	type:"GET",
	url:namedict,
	dataType:"xml",
	error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown);
		},
	success: function(xml){  
		var t="<table>";
		var tt="";
		var numSearchResult=0;
	
		 	$(xml).find('word').each(function(){
				if(numSearchResult>=8){
					return false;
				}
                var xmlword = new String($(this).text());
				if(getstr(xmlword).indexOf(getstr(input))==0){
					word=$(this).text();
					wordtype=$(this).parent().find('type').text();
					mean=$(this).parent().find('mean').text();
					id=$(this).parent().find('id').text();
					matchwords["id"][1]=id;
					matchwords["word"][1]=word;
					matchwords["wordtype"][1]=wordtype;
					matchwords["mean"][1]=mean;
					matchwords["result"][1]=0;
					numSearchResult++;
					if(getstr(xmlword).length==getstr(input).length){
						
						t+="<tr onclick='oneword("+id+")'><td>"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
					}else tt+="<tr onclick='oneword("+id+")'><td>"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
					}
            });
			
			$(xml).find('mean').each(function(){
                var xmlword = new String($(this).text());
				if(getstr(xmlword).search(getstr(input))!=-1){
					numSearchResult++;
					mean=$(this).text();
					wordtype=$(this).parent().find('type').text();
					word=$(this).parent().find('word').text();
					id=$(this).parent().find('id').text();
					matchwords["id"][1]=id;
					matchwords["word"][1]=word;
					matchwords["wordtype"][1]=wordtype;
					matchwords["mean"][1]=mean;
					matchwords["result"][1]=0;
					t+="<tr onclick='oneword("+id+")'><td>"+word+"</td><td>"+wordtype+"</td><td>"+mean+"</td></tr>";
				}
            });
		 
	document.getElementById("searchcontent").innerHTML=t+tt+"</table>";
}
});
	//alert(word.length)
}

function getstr(str){
	//大小写转化
	str=str.toLocaleLowerCase();
	//法语字符处理
	str=str.replace(/é/,"e").replace(/ç/,"c").replace(/à/,"a").replace(/ù/,"u").replace(/è/,"e").replace(/â/,"a").replace(/ê/,"e").replace(/û/,"u").replace(/î/,"i").replace(/ë/,"e").replace(/ï/,"i");
	//标点符号处理
	//str=str.replace(/,/," ").replace(/./," ");
	return str;
}

function oneword(x)
{
	rien()
	initpro();
	//pause=0;
	id=x*1-1;
	matchNumber=1;
	

	$.ajax({
	type:"GET",
	url:namedict,
	dataType:"xml",
	error: function(jqXHR, textStatus, errorThrown) {
        console.log('Error: ' + errorThrown);
		},
	success: function(xml){  
		 //alert($(xml).find('id').eq(id));
		 word=$(xml).find('id').eq(id).parent().find('word').text();
		 wordtype=$(xml).find('id').eq(id).parent().find('type').text();
		 mean=$(xml).find('id').eq(id).parent().find('mean').text();
		 tips()
		 
	document.getElementById("wordtype").innerHTML=wordtype;
	num=Math.random(0,3);
	switch(num%2){
	case 0:
	document.getElementById("keyword").innerHTML=word;
	document.getElementById("ans"+num).innerHTML=mean;
	answer=mean;
    //to do: a,b,c may be the same
	ansa=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	ansb=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	ansc=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('mean').text();
	break;
	case 1:
	document.getElementById("keyword").innerHTML=mean;
	document.getElementById("ans"+num).innerHTML=word;
	answer=word;
	//to do: a,b,c may be the same
	ansa=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	ansb=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	ansc=$(xml).find('id').eq((id+Math.random(1,numdict))%(numdict)).parent().find('word').text();
	break;
	default:break;
	}
	document.getElementById("ans"+(num+1)%4).innerHTML=ansa;
    document.getElementById("ans"+(num+2)%4).innerHTML=ansb;
    document.getElementById("ans"+(num+3)%4).innerHTML=ansc;
	}
	});
	
	document.getElementById("maincontent").style.display="block";
	document.getElementById("pass").style.display="none";
	document.getElementById("easy").style.display="block";
	document.getElementById("pause").style.display="block";
	document.getElementById("numQuestion").style.display="none";
	document.getElementById("numRight").style.display="none";
	$('#maincontent').addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated bounceInDown');
    });
}

function EnterPress(e){ //传入 event 
var e = e || window.event; 
if(e.keyCode == 13){ 
dosearch();
document.getElementById("searchword").focus(); 
document.getElementById("searchword").select();
cordova.plugins.Keyboard.close();
} 
} 


