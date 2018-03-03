$(function(){

	// ===============歌曲详情页======================== 

	// 展开与缩放歌曲详情页
	$("#btnExpandPlayBox").on("click",function () {
		// style: 展开歌曲详情页
		$("#pageSongDetail").css({
			"top":"60px",
			"right":0,
			"opacity":1
		});
	});
	$("#btnCompressPlayBox").on("click",function () {
		// style: 缩放歌曲详情页
		$("#pageSongDetail").css({
			"top":"100%",
			"right":"100%",
			"opacity":0
		});
	});
	
})