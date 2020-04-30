var vPlayDefault = [];
var vPlayList = [];

var sid = 0;
var ssid = 0;
var tid = 0;
var v;
var vCopy;
var v1;

var dayWeek;
var file;
var fileId = 0;
var fileArr = [];

var width;
var height;
var screenState;

var filelist = '../files/playfilelist.json';
var videoURL = '../files/playfiles';
var timestampData;
var timestamp;
var set;
var seekTime = 0;
var seek = 0;
var waiting = 0;
var url;
var copyurl;
var nowVideo = 'videoPlay';
var durationArr = [];

var leaveTime = -1;
var nextPlayTime = -1;

$(function() {
  autoEvent();
  file = getfile();
  dayWeek = getDayWeek();
  getList();
  window.addEventListener('resize', autoEvent);
});

function getList() {
  $.ajax({
    url: filelist,
    type: 'get',
    dataType: 'json',
    success: function(data) {
      fileArr = [];
      vPlayDefault = [];

      $(data.json).map(function(index, element) {
        if (data.json[index].dayOfWeek == dayWeek) {
          fileArr.push(data.json[index]);
        }
      });

      vPlayList = [];
      fileId = 0;
      tid = 0;
      getVideoData();
      checkWeekDay();
    }
  });
}

function checkWeekDay() {
  var now = changeStrToMinutes(nowTime());
  var next = 24 * 60;
  setTimeout(function() {
    dayWeek = getDayWeek();
    getList();
  }, (next - now) * 60 * 1000);
}

function getVideoData() {
  var url = fileArr[fileId].file;
  url = '..' + url;

  $.ajax({
    url: url,
    type: 'get',
    dataType: 'json',
    success: function(data) {
      vPlayList.push(data);
      if (fileId < fileArr.length - 1) {
        fileId += 1;
        getVideoData();
      } else {
        fileId = fileArr.length - 1;
        vPlayList.sort(compare('StartDT'));
        //console.log(vPlayList);
        durationArr = [];
        var now = changeStrToMinutes(nowTime());
        //console.log(now);
        timeKeep();
      }
    }
  });
}

function timeKeep() {
  var now = changeStrToMinutes(nowTime());

  $.each(vPlayList, function(index, value) {
    var planTime = vPlayList[index].StartDT;
    if (now >= planTime) {
      tid = index;
    }
  });

  if (v != undefined) v.remove();
  if (vCopy != undefined) vCopy.remove();

  v1 = document.createElement('video');
  v1.id = 'v1';
  v1.preload = 'auto';

  videoTimeSize();
  var nid = tid;
  if (nid < vPlayList.length - 1) {
    nid = nid + 1;
    var nextTime = vPlayList[nid].StartDT;

    setTimeout(function() {
      durationAr = [];
      timeKeep();
    }, (nextTime - now) * 60 * 1000);
  } else {
    nid = vPlayList.length - 1;
  }
}

function videoTimeSize() {
  var url = videoURL + '/' + vPlayList[tid].Videos.Video[ssid].Id + '/' + vPlayList[tid].Videos.Video[ssid].VideoPath;
  v1.addEventListener('loadedmetadata', getDuration);
  v1.src = url;
}

function getDuration(e) {
  durationArr.push(v1.duration);
  if (ssid < vPlayList[tid].Videos.Video.length - 1) {
    ssid += 1;
    videoTimeSize();
  } else {
    v1.removeEventListener('loadedmetadata', getDuration);
    ssid = 0;
    setVideoPlayId();
  }
}

function setVideoPlayId() {
  var arr = [];
  var min1 = 0;
  sid = 0;
  nowVideo = 'videoPlay';
  leaveTime = -1;

  $.each(durationArr, function(index, value) {
    min1 = min1 + value;
    arr.push(min1);
  });

  //console.log(arr);

  var nowStartTime = changeHourMinutestr(Number(vPlayList[tid].StartDT));
  nowStartTime = writeCurrrentDate(nowStartTime);
  var nowTime = new Date(nowStartTime);

  if (parent && parent.getRealTime != undefined) {
    timestamp = parent.getGMT();
    nowTime = parent.getRealTime(nowTime.getTime());
  } else {
    timestamp = new Date().getTime();
    nowTime = nowTime.getTime();
  }

  timestamp = timestamp / 1000;
  nowTime = nowTime / 1000;

  var targetTime = Math.abs(timestamp - nowTime);
  var cTime = targetTime % min1;

  $.each(arr, function(index, value) {
    if (cTime > value) {
      if (sid < arr.length - 1) {
        sid = sid + 1;
      }
    }
  });
  playList();
}

function playList() {
  //sid = 0;
  clearTimeout(set);
  url = videoURL + '/' + vPlayList[tid].Videos.Video[sid].Id + '/' + vPlayList[tid].Videos.Video[sid].VideoPath;
  if (sid < vPlayList[tid].Videos.Video.length - 1) copyurl = videoURL + '/' + vPlayList[tid].Videos.Video[sid + 1].Id + '/' + vPlayList[tid].Videos.Video[sid + 1].VideoPath;
  else copyurl = videoURL + '/' + vPlayList[tid].Videos.Video[0].Id + '/' + vPlayList[tid].Videos.Video[0].VideoPath;

  v = document.createElement('video');
  v.id = 'videoPlay';
  v.preload = 'auto';

  v.src = url;
  v.addEventListener('loadedmetadata', autoSize);
  v.addEventListener('playing', showVideo);

  if (nextPlayTime == -1) {
    setTimeout(function() {
      setSeekTime();
    }, 5000);
  } else {
    setSeekTime();
  }
}

function setSeekTime() {
  var arr = [];
  var min1 = 0;
  var seek = 0;
  waiting = 0;

  $.each(durationArr, function(index, value) {
    min1 = min1 + value;
    arr.push(min1);
  });

  /*if (leaveTime == -1) {
    var nowStartTime = changeHourMinutestr(Number(vPlayList[tid].StartDT));
    nowStartTime = writeCurrrentDate(nowStartTime);
    var nowTime = new Date(nowStartTime);



    timestamp = new Date().getTime();
    var targetTime = Math.abs(timestamp - nowTime.getTime());
    var passTime = targetTime % (min1 * 1000);

    if (sid == 0) {
      seek = passTime;
    } else {
      seek = passTime - arr[sid - 1] * 1000;
    }
  } else {
    seek = Math.abs(new Date().getTime() - nextTime);
  }
  

  var s = 0;
  if (durationArr[sid].toString().split('.')[1] != undefined) {
    s = durationArr[sid].toString().split('.')[1].length;
  }
  //seek = seek.toFixed(s);

  leaveTime = durationArr[sid] * 1000 - seek;
  nextTime = leaveTime + new Date().getTime();*/

  if (leaveTime == -1) {
    var nowStartTime = changeHourMinutestr(Number(vPlayList[tid].StartDT));
    nowStartTime = writeCurrrentDate(nowStartTime);
    var nowTime = new Date(nowStartTime);

    if (parent && parent.getRealTime != undefined) {
      var realnowTime = parent.getRealTime(nowTime.getTime());
      timestamp = parent.getGMT();
      targetTime = Math.abs(timestamp - realnowTime);
    } else {
      timestamp = new Date().getTime();
      targetTime = Math.abs(timestamp - nowTime.getTime());
    }

    var passTime = targetTime % (min1 * 1000);

    if (sid == 0) {
      seek = passTime;
    } else {
      seek = passTime - arr[sid - 1] * 1000;
    }
  } else {
    if (parent && parent.getRealTime != undefined) {
      var realnowTime = parent.getGMT();
      seek = Math.abs(realnowTime - nextTime);
    } else {
      seek = Math.abs(new Date().getTime() - nextTime);
    }
  }

  leaveTime = durationArr[sid] * 1000 - seek;

  if (parent && parent.getRealTime != undefined) {
    var realnowTime = parent.getGMT();
    nextTime = leaveTime + realnowTime;
  } else {
    nextTime = leaveTime + new Date().getTime();
  }

  set = setTimeout(function() {
    vEventList();
  }, leaveTime);

  if (nowVideo == 'videoPlay') {
    if (nextPlayTime == -1) {
      $('.videoWarp').append(v);
      if (seek > 20) {
        v.currentTime = seek / 1000;
      }
      v.play();
      nextPlayTime = 0;
    } else {
      if (seek > 20) {
        v.currentTime = seek / 1000;
      }
      v.play();
      vCopy.remove();
    }
  } else {
    if (seek > 20) {
      vCopy.currentTime = seek / 1000;
    }
    vCopy.play();
    v.remove();
  }

  if (nowVideo == 'videoPlay') nowVideo = 'videoCopy';
  else nowVideo = 'videoPlay';
}

function vEventList() {
  if (sid < vPlayList[tid].Videos.Video.length - 1) {
    sid += 1;
  } else {
    sid = 0;
  }

  if (nowVideo == 'videoPlay') {
    if (sid < vPlayList[tid].Videos.Video.length - 1) {
      copyurl = videoURL + '/' + vPlayList[tid].Videos.Video[sid + 1].Id + '/' + vPlayList[tid].Videos.Video[sid + 1].VideoPath;
    } else {
      copyurl = videoURL + '/' + vPlayList[tid].Videos.Video[0].Id + '/' + vPlayList[tid].Videos.Video[0].VideoPath;
    }
    $('.videoWarp').append(v);
  } else {
    if (sid < vPlayList[tid].Videos.Video.length - 1) {
      url = videoURL + '/' + vPlayList[tid].Videos.Video[sid + 1].Id + '/' + vPlayList[tid].Videos.Video[sid + 1].VideoPath;
    } else {
      url = videoURL + '/' + vPlayList[tid].Videos.Video[0].Id + '/' + vPlayList[tid].Videos.Video[0].VideoPath;
    }
    $('.videoWarp').append(vCopy);
  }
  setSeekTime();
}

function getfile() {
  var now = new Date();
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth(); //得到月份
  var date = now.getDate(); //得到日期
  var day = now.getDay(); //得到周几

  month = month + 1;
  if (month < 10) month = '0' + month;

  if (date < 10) date = '0' + date;

  var filename = '';
  filename = String(year) + String(month) + String(date);
  return filename;
}

function getDayWeek() {
  var now = new Date();
  var day = now.getDay();
  return day;
}

function nowTime() {
  var now = new Date();
  var hour = now.getHours(); //得到小时
  var minu = now.getMinutes(); //得到分钟
  var sec = now.getSeconds(); //得到秒
  if (hour < 10) hour = '0' + hour;
  if (minu < 10) minu = '0' + minu;
  if (sec < 10) sec = '0' + sec;

  var time = '';
  time = hour + ':' + minu + ':' + sec;

  return time;
}

function writeCurrrentDate(tt) {
  var now = new Date();
  var year = now.getFullYear(); //得到年份
  var month = now.getMonth(); //得到月份
  var date = now.getDate(); //得到日期
  var day = now.getDay(); //得到周几
  var hour = now.getHours(); //得到小时
  var minu = now.getMinutes(); //得到分钟
  var sec = now.getSeconds(); //得到秒
  var MS = now.getMilliseconds(); //获取毫秒
  var week;
  month = month + 1;
  if (month < 10) month = '0' + month;
  if (date < 10) date = '0' + date;
  if (hour < 10) hour = '0' + hour;
  if (minu < 10) minu = '0' + minu;
  if (sec < 10) sec = '0' + sec;
  if (MS < 100) MS = '0' + MS;
  //var arr_week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
  //week = arr_week[day];
  var time = '';
  //time = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;

  time = year + '-' + month + '-' + date + ' ' + tt;

  //console.log(time);

  //var t = "2017-12-08 20:5:30";  // 月、日、时、分、秒如果不满两位数可不带0.
  var T = new Date(time); // 将指定日期转换为标准日期格式。Fri Dec 08 2017 20:05:30 GMT+0800 (中国标准时间)
  //console.log(T.getTime());

  return T;
}

function changeStrToMinutes(str) {
  var arrminutes = str.split(':');

  if (arrminutes.length == 3) {
    var minutes = parseInt(arrminutes[0]) * 60 + parseInt(arrminutes[1]);
    return minutes;
  } else {
    return 0;
  }
}

function changeHourMinutestr(str) {
  if (str !== '0' && str !== '' && str !== null) {
    return (Math.floor(str / 60).toString().length < 2 ? '0' + Math.floor(str / 60).toString() : Math.floor(str / 60).toString()) + ':' + ((str % 60).toString().length < 2 ? '0' + (str % 60).toString() : (str % 60).toString()) + ':00';
  } else {
    return '';
  }
}

function compare(property) {
  return function(a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  };
}

function autoEvent() {
  width = $(window).width();
  height = $(window).height();

  if (v != undefined) autoSize();
  if (vCopy != undefined) autoSizeCopy();
}

function autoSize() {
  var aw = width;
  var ah = height;

  var position = coverContent(aw, ah, v.videoWidth, v.videoHeight);
  v.width = position.width;
  v.height = position.height;
  v.style.marginLeft = position.x + 'px';
  v.style.marginTop = position.y + 'px';
}

function autoSizeCopy() {
  var aw = width;
  var ah = height;

  var position = coverContent(aw, ah, vCopy.videoWidth, vCopy.videoHeight);
  vCopy.width = position.width;
  vCopy.height = position.height;
  vCopy.style.marginLeft = position.x + 'px';
  vCopy.style.marginTop = position.y + 'px';
}

function showVideo(e) {
  if (e.target.id == 'videoPlay') {
    createCopy();
  } else {
    createVideo();
  }
}

function countTime() {
  var now = new Date().getTime();
  var end = timestampData * 1000;

  var leftTime = end - now;

  var s;
  if (leftTime > 0) {
    s = Math.floor((leftTime / 1000) % 60);

    s = checkTime(s);

    $('.number').html(s);
    setTimeout(countTime, 1000);
  } else {
    v.play();
    $('.number').css('display', 'none');
  }
}

function checkTime(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

function createVideo() {
  v = document.createElement('video');
  v.id = 'videoPlay';
  v.preload = 'auto';
  v.src = url;
  v.addEventListener('loadedmetadata', autoSize);
  v.addEventListener('playing', showVideo);
}

function createCopy() {
  vCopy = document.createElement('video');
  vCopy.id = 'videoCopy';
  vCopy.preload = 'auto';
  vCopy.src = copyurl;
  vCopy.addEventListener('loadedmetadata', autoSizeCopy);
  vCopy.addEventListener('playing', showVideo);
}

function coverContent(aw, ah, cw, ch) {
  var tw = Math.max((ah * cw) / ch, aw);
  var th = Math.max((aw * ch) / cw, ah);
  var tx = (aw - tw) / 2;
  var ty = (ah - th) / 2;
  return {
    width: tw,
    height: th,
    x: tx,
    y: ty
  };
}
