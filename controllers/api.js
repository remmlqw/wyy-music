/**
 * New node file
 */

var mysql = require('mysql'); //调用MySQL模块
var fs = require('fs'); //加载文件模块

//请求歌单列表
exports.musicList = function(req, res) {
  var playlistID = req.query.playlistID;

  //创建连接池
  var pool = mysql.createPool({
    host: "119.29.111.28", user: 'root', //MySQL认证用户名
    password: '123456', //MySQL认证用户密码
    database: 'music',
    port: '3306' //端口号
  });

  // 从池子里面取一个可用连接
  pool.getConnection(function(err, connection) {
    //执行查询
    var selectSQL = "select * from playlist where id=" + playlistID;
    pool.query(selectSQL, function(err, playlistRs) {
      if (err) {
        console.log('查询失败:' + err);
        return;
      }
      var songlistStr = playlistRs[0].songListStr; //歌曲列表字符串
      var songlistIdArr = [];
      var songlist = []; //歌曲对象列表
      songlistIdArr = songlistStr.split(","); //分割成[1,2,3,4]的数组
      var songNum = 0;
      for (var i = 0; i < songlistIdArr.length; i++) {
        (function(i) {
          selectSQL = "select * from albumlist,musiclist where musiclist.AlbumId=albumlist.id and musiclist.id=" + songlistIdArr[i];
          connection.query(selectSQL, function(err, rs) {
            if (err) {
              console.log('查询失败:' + err);
              return;
            }
            songlist.push(rs[0]);
            songNum++;
            if (songNum == songlistIdArr.length) {
              playlistRs[0].songlist = songlist;
              res.json(playlistRs[0]);
              connection.release();
            }
          });
        })(i)
      }

    });
  })

}

//请求歌词
exports.lyric = function(req, res) {
  var id = req.query.id;

  //创建一个connection
  var connection = mysql.createConnection({
    host: "119.29.111.28", user: 'root', //MySQL认证用户名
    password: '123456', //MySQL认证用户密码
    database: 'music',
    port: '3306' //端口号
  });

  //创建一个connection
  connection.connect(function(err) {
    if (err) {
      console.log('连接错误 :' + err);
      return;
    }
    console.log('连接成功！');
  });

  //执行查询 （按照歌曲id查询歌词地址）
  var selectSQL = "select lrcUrl from musiclist where id=" + id + "";
  connection.query(selectSQL, function(err, rs) {
    if (err) {
      console.log('查询失败:' + err);
      return;
    }
    fs.readFile(rs[0].lrcUrl, 'utf-8', function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        res.send(data);
      }
    })
  });

  //关闭connection
  connection.end(function(err) {
    if (err) {
      console.log(err.toString());
      return;
    }
    console.log('数据库关闭成功');
  });

}
