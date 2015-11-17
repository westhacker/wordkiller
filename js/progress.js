function initpro() {
    var pro = $( "#progressbar" );   //进度条div
    pro.progressbar({
      value: false,   //初始化的值为0
	  complete: function() {
      //当进度条完成时
        //alert("答题超时！")
		wrong++;
		score();
		
		if(matchNumber==1){
			var t=setTimeout("initsearch()",50);
			matchNumber=10;
			return false;
		}

		if(numQ==0){
			var t=setTimeout("initword()",50);
		}else if(numQ<matchNumber){
			numP++;
			matchwords["id"][numQ]=id;
			matchwords["word"][numQ]=word;
			matchwords["wordtype"][numQ]=wordtype;
			matchwords["mean"][numQ]=mean;
			matchwords["result"][numQ]=0;
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
		else if(currentIndex<=matchNumber){
			//var t=setTimeout("wrongid()",50);
			//initpro();
			changeans();
		}else finishreview();

		if(numQ>0){
			numQ++;
			document.getElementById("numQuestion").innerHTML=numQ+"/"+matchNumber;
	        document.getElementById("numRight").innerHTML=numR+"/"+(numQ-1)*1;
		}
	}
	});
    //延迟500毫秒调用修改value的函数
    setTimeout( checkvalue, 500);
    //动态修改value的函数
} 

function checkvalue(){
	var pro = $( "#progressbar" );   //进度条div
	//alert(pro.progressbar("value"))
	if(pro.progressbar("value")==false){addValue()}
}
 
function addValue(){
	if(pause==1){return;}
       var pro = $( "#progressbar" );
       var newValue = pro.progressbar("value") +1;
       pro.progressbar("value",newValue); //设置新值
	   if( newValue == 78) {
	   		document.getElementById("sound").src="wav/alert.mp3";
		document.getElementById("sound").play();	}
       if( newValue >= 100) {return;}    //超过100时，返回
 
       setTimeout( addValue, 120);
    }