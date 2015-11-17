var timestamp = 0;  
var url = 'http://www.appinair.com/wordkiller/startpvp.php';  
var error = false; 
var opuid = 19910604;
var uid = 19901118;

    // 通过ajax建立和php端处理函数的连接(通过递归调用建立长时间的连接)  
    function connect2(){  
        $.ajax({
            jsonp: "callback",
            dataType: "jsonp",
            data : {'timestamp' : timestamp},  
            url : url,  
            type : 'get',  
            timeout : 0, 
        
            success : function(response){
				alert(response)
                var data = JSON.parse(response);  
                alert(data)
                error = false;  
                timestamp = data.timestamp;  
                if (data.msg != undefined && data.msg != "")  
                {  
                    //$("#head").append("<div>" + data.msg + "</div>");  
                    alert(data.msg);
                }  
            },  
            error : function(){  
                error = true;  
                setTimeout(function(){ connect();}, 30000);  
            },  
            complete : function(){  
                if (error)  
                    // 请求有错误时,延迟5s再连接  
                    setTimeout(function(){connect();}, 30000);  
                else  
                    connect();  
            }  
        })  
    }  

    function connect3(){
        $.getJSON( "http://www.appinair.com/wordkiller/test.json", function( data ) {
          alert(data)
        
        });
    }
    // 发送信息  
    function send(msg){  
        $.ajax({  

            data : {'msg' : msg},  
            type : 'get',
            
            url : url  
        })  
    } 

    // 创建长时间的连接  
    //$(document).ready(function(){  
        //connect();  
    //})  


// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}


// 发起对战
function startPVP() {
  // All HTML5 Rocks properties support CORS.
  var action = "start";
  var url = 'http://www.appinair.com/wordkiller/startpvp.php?uid='+uid+'&opuid='+opuid+'&action='+action;

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var start = text.indexOf('{');
    var end = text.indexOf('}')+1;
    text = JSON.parse(text.substring(start,end));

    if(text.result==0){
	  giveupPVP();
      document.getElementById("msgbutton").innerHTML="Your adversary "+ text.opuid+"is busy now, Retry!";
    }else {
        document.getElementById("msgbutton").innerHTML="Wait for your adversary: "+ text.opuid+", Cancel!";
		waitPVP();
        document.getElementById("msgbutton").onclick=function(){
          giveupPVP();
          initpvp();
        };
      }
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
    //setTimeout(function(){ connect();}, 5000);
  };

  xhr.onloadend = function () {
      //setTimeout(function(){ connect();}, 5000);
  }

  xhr.send();
}

// 发起对战
function giveupPVP() {
  // All HTML5 Rocks properties support CORS.
  var action = "giveup";
  var url = 'http://www.appinair.com/wordkiller/startpvp.php?uid='+uid+'&opuid='+opuid+'&action='+action;

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    alert("成功取消对战");
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
    //setTimeout(function(){ connect();}, 5000);
  };

  xhr.onloadend = function () {
      //setTimeout(function(){ connect();}, 5000);
  }

  xhr.send();
}

//hunt for PVP
function huntPVP() {
  // All HTML5 Rocks properties support CORS.
  var action = "hunt";
  var url = 'http://www.appinair.com/wordkiller/startpvp.php?uid='+null+'&opuid='+uid+'&action='+action;

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var start = text.indexOf('{');
    var end = text.indexOf('}')+1;
    text = JSON.parse(text.substring(start,end));
    if(text.uid==null){
		setTimeout(function(){ huntPVP();}, 10000);
	}else{
		alert(text.uid+"找你对战！");
		
		return false;
	}
		
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
	setTimeout(function(){ huntPVP();}, 10000);
  };

  xhr.onloadend = function () {
      setTimeout(function(){ huntPVP();}, 10000);
  }

  xhr.send();
}

//wait for PVP
function waitPVP() {
  // All HTML5 Rocks properties support CORS.
  var action = "wait";
  var url = 'http://www.appinair.com/wordkiller/startpvp.php?uid='+null+'&opuid='+uid+'&action='+action;

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var start = text.indexOf('{');
    var end = text.indexOf('}')+1;
    text = JSON.parse(text.substring(start,end));
    if(text.uid==null){
		alert("对方取消了对战请求");
		return false;
	}else if(text.numQ==1){
		alert("对战开始");
		return false;
	}else if(text.numQ==0){
		setTimeout(function(){ waitPVP();}, 10000);
		}
		
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
	setTimeout(function(){ waitPVP();}, 10000);
  };

  xhr.onloadend = function () {
  }

  xhr.send();
}

// Make the actual CORS request.
function makeCorsRequest() {
  // All HTML5 Rocks properties support CORS.
  var url = 'http://www.appinair.com/wordkiller/startpvp.php?uid='+uid+'&opuid='+opuid;

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var start = text.indexOf('{');
    var end = text.indexOf('}')+1;
    text = JSON.parse(text.substring(start,end));
    alert('Response from CORS request to ' + url + ': '+ text.uid);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
    //setTimeout(function(){ connect();}, 5000);
  };

  xhr.onloadend = function () {
      //setTimeout(function(){ connect();}, 5000);
  }

  xhr.send();
}