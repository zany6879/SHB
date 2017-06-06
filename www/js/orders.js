/**
 * Created by Administrator on 2017/6/1.
 */
$().ready(function () {
    var id = localStorage.getItem('mid');
    var title = localStorage.getItem('title');
    var code = {mid: id};
    var pay_style = {
        wapwechatpay: "微信支付",
        credit: "微信平台-余额",
        wx_cre: "微信+余额",
        alipay: "支付宝支付",
        ali_chun: "支付宝平台 余额",
        ali_cre: "支付宝+余额"
    };
    //刷新加载功能
    // $('.body').dropload({
    //     loadDownFn : function(me){
    //
    //
    //         me.resetload();
    //     }
    // });
    //日期选择插件
    var startTime = new LCalendar();
    startTime.init({
        'trigger': '#startTime', //标签id
        'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
        'minDate': '1900-1-1', //最小日期
        'maxDate': new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() //最大日期
    });
    var endTime = new LCalendar();
    endTime.init({
        'trigger': '#endTime', //标签id
        'type': 'date', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
        'minDate': '1900-1-1', //最小日期
        'maxDate': new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() //最大日期
    });

    $('#onSearch').click(function () {
        $('#item').empty();
        var start= $('#startTime').val();
        var end= $('#endTime').val();
        $.ajax({
            url:'http://172.20.9.226:8080/NoteApp/Index/indexs',
            data:{mid:id,today:start,midnight:end},
            type:'post',
            dataType:'json',
            success:function (result) {
                console.log(result);
                if(result.code==1){
                    var data = result.data;
                    getItem();
                    // 更新列表
                    function getItem() {
                        for (var i = 0; i < data.length; i++) {
                            $('#item').append('<tr> ' +
                                '<td style="padding-left: 50px" class="am-text-middle">' + (i+1) + '</td> ' +
                                '<td class="am-text-middle"> ' +
                                '<ul> ' +
                                '<li>商品名称：&nbsp' + data[i].goods_name + '</li> ' +
                                '<li id="money">订单金额：&nbsp' + data[i].prices + '</li> ' +
                                '<li>订单时间: &nbsp' + new Date(parseInt(data[i].create_time) * 1000).toLocaleString().substr(10) + '</li> ' +
                                '<li>支付类型:&nbsp ' + pay_style[data[i].pay_type] + '</li>' +
                                '<li>订单编号：&nbsp' + data[i].order_no + '</li> ' +
                                '</ul> ' +
                                '</td> ' +
                                '</tr>');
                        }
                        $('.totalItem').text('总订单：' + data.length + '单');
                        $('.totalItem').attr('style', 'color:red');
                        $('.totalMoney').text('总金额：' + result.moneys + '元');
                        $('.totalMoney').attr('style', 'color:red');
                    }
                }else{
                    $('#item').append('<div id="mes">没有订单,请重新查找!</div>')
                }
            },
            error: function (er) {
                swal('服务超时！');
            }
        })
    });
});