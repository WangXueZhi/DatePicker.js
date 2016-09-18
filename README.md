# DatePicker.js

```
new DatePicker(DomId, data, changeDateCallBack);
```

##参数说明

###DomId
DOM的id，只支持id

###data
一个月的数据，数据格式如下
```
var data = [
  {day: 2, data:''},
  {day: 6, data:''},
  {day: 15, data:''},
  {day: 18, data:''},
  {day: 28, data:''}
]
```

###changeDateCallBack
改变月份时触发，返回年，月，和渲染方法，使用方式如下

```
var datapicker = new DatePicker('datapicker', data, function(year, month, render) {
    //根据 年，月 发送请求获取数据，然后执行render，传入this,年月以及新数据mewData
    render.call(this, year, month, newData);
});
```
