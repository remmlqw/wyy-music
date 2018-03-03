/**
  * Theme: player
  * Dependence: jQuery
  *
  */


/**
  * @Theme: dragProgress
  * @Param: data:{$progressArc,$progressBar,$progressBox,$audio,type,callback_move,callback_up}
  *
  */
var dragProgress=function (data) {
	var $progressArc=data.$progressArc,//进度条圆点
		$progressBar=data.$progressBar,//进度条本身
		$progressBox=data.$progressBox,//进度条父级
		$audio=data.$audio,//audio JQ对象
		type = data.type;



/*
 * ie9以下浏览器只支持 getBoundingClientRect 方法的 top 、bottom、right、left属性；
 * ie9 和其它浏览器支持 getBoundingClientRect 方法 有6个属性 top 、bottom、right、left、width和height；
 *
 */

	// 鼠标按下进度条小圆点
	$progressArc.on("mousedown",function (ev) {
			progressBox_offset=$progressBox.get(0).getBoundingClientRect(),//进度条父级相对于页面的位置集合
			changeVal=0;
	    var ev=ev?ev:window.event;
	    var ex=ev.clientX;//鼠标按下的X轴位置

	    var moveArc=function (ev) {
	    		  ev.preventDefault();
            // 更新进度条
            var ev=ev?ev:window.event;
            var ex2=ev.clientX;
            var disX2=(((ex2-progressBox_offset.left)/progressBox_offset.width)*100).toFixed(2);
           	disX2=disX2<=0?0:(disX2>=100?100:disX2);
	        // 判断是否可以播放
	        if (!!$audio.attr("src")  || type=="volume") {
		        $progressBar.css("width",disX2+"%");
	           	// 更新
	           	changeVal=data.callback_move && data.callback_move(disX2);
	        }
	    };
	    var offmouseup=function () {
			$(document).off("mousemove",moveArc);
			$(document).off("mouseup",offmouseup);
			// 判断是否可以播放
			if (!!$audio.attr("src")) {
	        	// 更新
				data.callback_up && data.callback_up(changeVal);
	        }

		};
		// 鼠标移动
	    $(document).on("mousemove",moveArc);
		// 鼠标抬起
		$(document).on("mouseup",offmouseup);

	});
};


/**
 * @Theme: 时间格式转换
 * @Param: seconds
 * @Memo: s-> h:m:s  1-> 01
 *
 */
var formatTime=function (seconds) {
	if(!seconds) {
		seconds = 0;
	}
	var h=0,
		i=0,
		s=Math.floor(seconds);
		h=Math.floor(s/3600);//时
		i=Math.floor((s%3600)/60);//分
		s=s%3600%60;//秒

	return {
		H:h=h<10?"0"+h:h,
		I:i=i<10?"0"+i:i,
		S:s=s<10?"0"+s:s
	};
};

/**
 * @Theme: 提示框
 * @Param: tipType,tipText
 *			tipType: "error" | "info" | "ok"
 *
 */
var showTipBox=function (tipType,tipText) {
	$("#tipsBox").find(".tip").each(function (index,item) {
		$(item).removeClass("show");
	});
	$("#tipsBox").find(".tip_"+tipType).addClass("show").find(".tiptext").html(tipText);
	$("#backScreen").css("display","block");//淡灰色的背景
	//animationend  在 CSS 动画结束后为元素添加监听事件
	$("#tipsBox").css("display","block").on("animationend",function () {
		$(this).css("display","none");
		$("#backScreen").animate({
			"opacity":"0"
		},30,function () {
			$(this).css({
				"display":"none",
				"opacity":1
			});
		});
	});
};


/**
 * @Theme: play btn switch style
 * @Param: $ele (eg: $("#playBtnGroup").find(".play")), playType:["play","pause"]
 */
var stylePlayBtn=function ($ele,playType) {
	var html_play='<i class="fa fa-play" aria-hidden="true"></i>';
	var html_pause='<i class="fa fa-pause" aria-hidden="true"></i>';
	$ele.html((playType==="play"?html_pause:html_play));

};


/**
 * @Theme: audio error
 * @Param: audio对象
 *
 */
var audioError=function (audio) {
	// 音频数据出错
   // 0 = NETWORK_EMPTY - 音频/视频尚未初始化
   // 1 = NETWORK_IDLE - 音频/视频是活动的且已选取资源，但并未使用网络
   // 2 = NETWORK_LOADING - 浏览器正在下载数据
   // 3 = NETWORK_NO_SOURCE - 未找到音频/视频来源
   switch (+audio.networkState) {
   	case 0:
   		showTipBox("error","音频尚未初始化");
	    	break;
   	case 1:
   		// showTipBox("error","音频是活动的且已选取资源，但并未使用网络");
	    	break;
   	case 2:
   		showTipBox("error","浏览器正在下载数据");
	    	break;
   	case 3:
   		showTipBox("error","未找到音频来源");
	    	break;
   	default:console.warn("SWITCH ERROR");
	    	break;
   }
}

/**
 * @Theme: 初始化歌单列表
 * @Param: {$infoList_playlist,info}
 *
 */
function initPlaylist(data){
	var $infoList_playlist = data.$infoList_playlist;//歌曲信息列表的父级id
	var info = data.info;//歌曲信息
	var htmlStr = "";
	$infoList_playlist.html("");
	for(var i=0;i<info.length;i++) {
		htmlStr += '<tr data-audio='+info[i].MusicUrl+' data-songID='+i+'>'
		+	'<td class="index">'+(i+1>=10?i+1:('0'+(i+1)))+'</td>'
		+	'<td>'
		+		'<i class="fa fa-heart-o" aria-hidden="true"></i>&nbsp;'
		+		'<i class="fa fa-download" aria-hidden="true"></i>'
		+	'</td>'
		+	'<td>'+info[i].MusicName+'</td>'
		+	'<td>'+info[i].Singer+'</td>'
		+	'<td>'+info[i].AlbumName+'</td>'
		+	'<td>'+info[i].Duration+'</td>'
		+'</tr>';
	}
	$infoList_playlist.html(htmlStr);
}

/**
 * @Theme: 播放一首歌曲
 * @Param: ({$audio,$duration,$playBtn,$infoList_playlist,$smallwindow_songName,$smallwindow_singerName,info,$songDetail},_this)
 *
 */
function playTheSong(data,_this) {
	var $audio = data.$audio;
	var $duration = data.$duration;//时长
	var $playBtn = data.$playBtn;
	var $infoList_playlist = data.$infoList_playlist;
	var $smallwindow_songName = data.$smallwindow_songName;
	var $smallwindow_singerName = data.$smallwindow_singerName;
	var originname = data.originname;//歌单名称（来源）
	var $songDetail = data.$songDetail;
	var songID = data.songID;
	var $progress_cache = data.$progress_cache;

	$progress_cache.css("width","0");//初始化缓冲条

	//改变歌曲列表的序号、喇叭样式
	$infoList_playlist.find(".index").html(function(index,value){
		var id = parseInt($(this).parent().attr("data-songid"));
		$(this).css("color","#9c9c9c").removeClass("active");
		return id+1>=10?id+1:('0'+(id+1));
	});

	$infoList_playlist.find(".index").eq(songID).css("color","#c52f30").addClass("active").html('<i class="fa fa-volume-up" aria-hidden="true"></i>');

	if($audio[0].src == _this.MusicUrl && !$audio[0].ended) {//点击的就是正在放的音乐，并且这首歌没有结束
		return;
	}
	$audio.attr("src",_this.MusicUrl);
	$audio[0].play();//重新播放
	stylePlayBtn($playBtn,"play");//把播放按钮改为播放样式
	$audio.on("canplay",function(){
		var objTimeDuration=formatTime($audio[0].duration);//音频长度
		$duration.html(objTimeDuration.I+":"+objTimeDuration.S);
	})
	$smallwindow_songName.html(_this.MusicName);//小窗歌名
	$smallwindow_singerName.html(_this.Singer);//小窗歌手名

	// 刷新歌词页面基本信息
	$songDetail.find(".songname").html(_this.MusicName);
	$songDetail.find(".albumname").html(_this.AlbumName);
	$songDetail.find(".singersname").html(_this.Singer);
	$songDetail.find(".originname").html(originname);

	$.ajax({
		type : "get",
		url : "api/lyric",
		data : {
			id : _this.id
		},
		success : function(res){
//			console.log(res);
			//歌词滚动
			mainLrcScroll({
				"jQ_lrcContainer":$("#lrcContainer"),
				"jQ_lrcBox":$("#lrcBox"),
				"jQ_audio":$("#audio"),
				"str":res,
			});
		}
	})

	//歌曲播放完成时触发
	$audio.on("ended",function(){
		playTheSong(data,_this);//循环播放
	})

}

function initPlaylistInfo(data){
	  var $playlist_listName = data.$playlist_listName,
		$playlist_userName = data.$playlist_userName,
		$playlist_createTime = data.$playlist_createTime;
		var info = data.info;
		$playlist_listName.html(info.playlistName);
		$playlist_userName.html(info.creator);
		$playlist_createTime.html(info.createTime);
}

$(function(){

	var isDrag=false; // 是否允许拖动进度条
	var curPlayNum=0; // 当前播放曲目序号 从0开始
	var songSum=0; //播放列表曲目总数

	var $audio = $("#audio");//audio（JQ对象）
	var media=$("#audio").get(0);//audio（原生对象）
	var $playBtnGroup = $("#playBtnGroup");//播放控制按钮

	var $curTime =  $("#audio_currentTime");//当前时间
	var $duration = $("#audio_duration");//时长
	var $time_progressBar = $("#progress_bar");// 进度条本身

	var	$time_progressBox=$("#progress_box"); // 进度条父元素
	var	$time_progressBar=$("#progress_bar"); // 进度条本身
	var	$time_progressArc=$("#progress_arc"); // 圆点
	var $infoList_playlist=$("#infoList_playlist");//歌单列表
	var $progress_cache=$("#progress_cache"); // 缓冲进度条

	var $vol_progressBox=$("#vol_progress_box"); // 音量进度条父元素
	var $vol_progressBar=$("#vol_progress_bar"); // 音量进度条本身
	var $vol_progressArc=$("#vol_progress_arc"); // 音量圆点
	var $muteBtn=$("#muteBtn"); // 静音按钮

	var $smallwindow_songName = $("#smallwindow_songName");//歌曲详情小窗歌名
	var $smallwindow_singerName = $("#smallwindow_singerName");//歌曲详情小窗歌手名
	var $songDetail = $("#songDetail"); // 歌曲详情页信息
	var $bgDisc=$("#bgDisc"); // 歌曲详情页 磁盘
  var $discNeedle=$("#discNeedle"); // 歌曲详情页 磁针

  var $playlist_listName = $("#playlist_listName"); //歌单名称
  var $playlist_userName = $("#playlist_userName");//歌单创建者名称
  var $playlist_createTime = $("#playlist_createTime");//歌单创建时间

  var $pageMylike = $("#pageMylike");//“我喜欢的音乐”页面

  // ===============点击我喜欢的音乐========================
	// $("#list_create_like").on("click",function(){
		// $pageMylike.show();//显示“我喜欢的音乐”页面
		//歌单ID
		// var playlistID = this.dataset.id;
    var playlistID = "1";
		// ===================请求歌单列表============================
		$.ajax({
			type:"get",
			url:"api/musicList",
			async:true,
			data : {
				playlistID : playlistID
			},
			success: function(res){
				//console.log(res.songlist);
				var songlistInfo = res.songlist.sort(function(a,b){return a.id - b.id});
				songSum = res.songlist.length;//播放列表曲目总数
				// ===================初始化歌单信息============================
				initPlaylistInfo({
					$playlist_listName : $playlist_listName,
					$playlist_userName : $playlist_userName,
					$playlist_createTime : $playlist_createTime,
					info : res
				})

				// ===================初始化歌单列表============================
				initPlaylist({
					$infoList_playlist : $infoList_playlist,//歌曲信息列表的父级id
					info : songlistInfo//歌曲信息
				})

				var $infolistItems = $infoList_playlist.find("tr");//歌曲列表中的每一行
				// ===================双击歌曲列表============================
				$infolistItems.on("dblclick",function(){
					var songID = parseInt(this.dataset.songid);
					curPlayNum = songID;//当前播放曲目序号
					playTheSong({
						$audio : $audio,
			 			$duration : $duration,//时长
						$playBtn : $playBtnGroup.find(".play"),//播放按钮
						$infoList_playlist : $infoList_playlist,//歌曲信息列表的父级id
						$smallwindow_songName : $smallwindow_songName,
						$smallwindow_singerName : $smallwindow_singerName,
						$songDetail : $songDetail,
						originname : res.playlistName,//歌单名称
						songID : songID,
						$progress_cache : $progress_cache
					},songlistInfo[songID]);
				})

				// ===================单击歌曲列表============================
				$infolistItems.on("click",function(){
					$infoList_playlist.find(".index").not(".active").css("color","#9c9c9c");
					$(this).find(".index").not(".active").css("color","#000");
					$(this).addClass("active").siblings().removeClass("active");
				})

				// ===================下一首============================
				$playBtnGroup.find(".next").on("click",function(){
					var nextPlayNum = (curPlayNum+1)%songSum;
					curPlayNum = nextPlayNum;
					playTheSong({
						$audio : $audio,
			 			$duration : $duration,//时长
						$playBtn : $playBtnGroup.find(".play"),//播放按钮
						$infoList_playlist : $infoList_playlist,//歌曲信息列表的父级id
						$smallwindow_songName : $smallwindow_songName,
						$smallwindow_singerName : $smallwindow_singerName,
						$songDetail : $songDetail,
						originname : res.playlistName,//歌单名称
						songID : nextPlayNum,
						$progress_cache : $progress_cache
					},songlistInfo[nextPlayNum]);
				})

				// ===================上一首============================
				$playBtnGroup.find(".prev").on("click",function(){
					var nextPlayNum = (curPlayNum-1)<0 ? songSum-1 : curPlayNum-1;
					curPlayNum = nextPlayNum;
					playTheSong({
						$audio : $audio,
			 			$duration : $duration,//时长
						$playBtn : $playBtnGroup.find(".play"),//播放按钮
						$infoList_playlist : $infoList_playlist,//歌曲信息列表的父级id
						$smallwindow_songName : $smallwindow_songName,
						$smallwindow_singerName : $smallwindow_singerName,
						$songDetail : $songDetail,
						originname : res.playlistName,//歌单名称
						songID : nextPlayNum,
						$progress_cache : $progress_cache
					},songlistInfo[nextPlayNum]);
				})

			}
		});

	// })



	// ===================播放器============================

	// 播放按钮
	$playBtnGroup.find(".play").on("click",function () {
		if (!media.src) {
			showTipBox("info","没有播放资源，请选择曲目");
		} else {
			if (!media.paused) {
				media.pause();
				// play按钮样式
				stylePlayBtn($playBtnGroup.find(".play"),"pause");
			} else {
				media.play();
				// play按钮样式
				stylePlayBtn($playBtnGroup.find(".play"),"play");
			}
			audioError(media);
		}
	});





	/**
  * @Theme: clickProgressBox（点击进度条）
  * @Param: data:{$progressBar,$progressBox,$audio}
  *
  */
	var clickProgressBox = function(data) {
		  var $progressBar=data.$progressBar,//进度条本身
			$progressBox=data.$progressBox,//进度条父级
			$audio=data.$audio;//audio JQ对象

			$progressBox.on("mousedown",function(ev){
						var progressBox_offset=$progressBox.get(0).getBoundingClientRect();//进度条父级相对于页面的位置集合
						var $target = $(ev.target);//最初触发事件的DOM元素。
						if($target.attr("id") == "progress_arc"){//如果点的是小圆点    就不执行下面的代码（说明用户想拖拽）  不然会有bug
							return;
						}
						var ev=ev?ev:window.event;
	          var ex2=ev.clientX;
	          var disX2=(((ex2-progressBox_offset.left)/progressBox_offset.width)*100).toFixed(2);
	          disX2=disX2<=0?0:(disX2>=100?100:disX2);
		        // 判断是否可以播放
		        if (!!$audio.attr("src")) {
			        $progressBar.css("width",disX2+"%");
		           	// 更新
		          var changeVal=($audio[0].duration*disX2/100).toFixed(2);
	           	var objTime=formatTime(changeVal);
	           	$curTime.html(objTime.I+":"+objTime.S);
	           	$audio[0].currentTime=changeVal;
		        }
			})

	}

	// ===============播放监听事件=======================

	// 更新时间
	$(media).on("timeupdate",function () {
		if (!isDrag) {
			var objTimeCurTime=formatTime(this.currentTime);//当前播放时间
			var objTimeDuration=formatTime(this.duration);//音频长度
			$curTime.html(objTimeCurTime.I+":"+objTimeCurTime.S);
			$duration.html(objTimeDuration.I+":"+objTimeDuration.S);
			// 更新进度条
			$time_progressBar.css("width",(this.currentTime/this.duration).toFixed(4)*100+"%");
		}
	});



	// ===============拖动进度条事件=======================

	// 改变时间
	dragProgress({
		$progressBox:$time_progressBox,
		$progressBar:$time_progressBar,
		$progressArc:$time_progressArc,
		$audio:$(media),
		type : "time",//拖动条类型   播放时间/音量
		callback_move:function (disX2) {
			// 改变播放时间
			isDrag=true;
           	var changeVal=(media.duration*disX2/100).toFixed(2);
           	var objTime=formatTime(changeVal);
           	$curTime.html(objTime.I+":"+objTime.S);
           	return changeVal;//返回播放时间
		},
		callback_up:function (changeVal) {
			// 改变播放位置
			isDrag=false;
			media.currentTime=changeVal;
//			stylePlayBtn($playBtnGroup.find(".play"),"play");
		}
	});

	// ===============点击进度条事件=======================
	clickProgressBox({
		$progressBar:$time_progressBar,
		$progressBox:$time_progressBox,
		$audio:$(media)
	})

	// ===============改变音量=======================
	dragProgress({
		$progressBox:$vol_progressBox,
		$progressBar:$vol_progressBar,
		$progressArc:$vol_progressArc,
		$audio:$(media),
		type : "volume",
		callback_move:function (disX2) {
			// 更新音量
        	media.volume=(1*disX2/100).toFixed(2);
           	if (media.volume<=0) {
           		$muteBtn.html('<i class="fa fa-volume-off" aria-hidden="true"></i>')
           	} else {
           		$muteBtn.html('<i class="fa fa-volume-up" aria-hidden="true"></i>')
           	}
//         	console.log(media.volume);
           	return 0;
		}
	});

	// =======================磁盘转动动画===========================

	// 监听音频播放事件
	$(media).on("play",function () {
		// 转盘动画恢复
		$bgDisc.css({
			"-webkit-animation-play-state":"running",
			"animation-play-state":"running"
		});
		// 磁针放下
		$discNeedle.addClass("play");
	});
	// 监听音频暂停事件
	$(media).on("pause",function () {
		// 转盘动画停止
		$bgDisc.css({
			"-webkit-animation-play-state":"paused",
			"animation-play-state":"paused"
		});
		// 磁针抬起
		$discNeedle.removeClass("play");
	});

	// ===================缓冲进度=======================

	// 判断文件缓冲进度
	timer=setInterval(function () {
		// 音频就绪 media.readyState==4 可用数据足以开始播放
		if (media.readyState===4) {
			// 获取已缓冲部分的 TimeRanges 对象
			var timeRanges = media.buffered;

			// 获取最后缓存范围的位置
			var timeBuffered = timeRanges.end(timeRanges.length-1);
//			console.log(timeBuffered)
			// 获取缓存进度，值为0到1
			var bufferPercent = (timeBuffered / media.duration).toFixed(3);
			// 更新缓冲进度条
			$progress_cache.css("width",bufferPercent*100+"%");
//			console.log(media.readyState);
		}
	},30);

})
