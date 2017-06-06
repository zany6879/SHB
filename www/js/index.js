    /**
 * Created by Administrator on 2017/4/24.
 */
$().ready(function () {
    var user = localStorage.getItem('tel');
    var id = localStorage.getItem('mid');
    var code = {mid: id};
    var pay_style = {
        wapwechatpay: "微信支付",
        credit: "微信平台-余额",
        wx_cre: "微信+余额",
        alipay: "支付宝支付",
        ali_chun: "支付宝平台 余额",
        ali_cre: "支付宝+余额"
    };
    $('#title').text(user);
    var date = new Date();
    var d = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " ";
    console.log(d);
    $('.tittle').text(d + '06:00-' + '次日06:00' + '全部订单');
    var get = function () {
        $.ajax({
            url: 'http://t.maidanfanli.com/NoteApp/Index/index',
            data: code,
            type: 'get',
            dataType: 'json',
            success: function (result) {
                if (result.code == 1) {
                    localStorage.setItem('title', result.data[0].goods_name);
                    var data = result.data;
                    getItem();
                    // 更新列表
                    function getItem() {
                        for (var i = 0; i < data.length; i++) {
                            $('#item').append('<tr> ' +
                                '<td style="padding-left: 50px" class="am-text-middle">' + (data.length - i) + '</td> ' +
                                '<td class="am-text-middle"> ' +
                                '<ul> ' +
                                '<li>商品名称：&nbsp' + data[i].goods_name + '</li> ' +
                                '<li id="money">订单金额：&nbsp' + data[i].prices + '</li> ' +
                                '<li>订单时间: &nbsp' + new Date(parseInt(data[i].create_time) * 1000).toLocaleString().substr(9) + '</li> ' +
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
                } else {
                    $('#item').append('<div id="mes">今天没有订单!</div>')
                }
            },
            error: function (er) {
                swal('服务超时！');
            }
        });
    };
    if (id == null) {
        location.href = "templates/login.html";
    } else {
        get();
    }
    //刷新功能
    $('.body').dropload({
        loadUpFn: function (me) {
            $('#item').empty();
            get();
            setTimeout(function () {
                me.resetload()
            }, 1000)
        }
    });
    //推送
    // 连接服务端
    var socket = io('http://60.205.185.64:2120/');
    socket.on('connect', function () {
        socket.emit('login', id);
    });
    // 后端推送来消息时
    socket.on('new_msg', function (msg) {
        if (msg != null) {
            $('#test').html(msg);
            $('#test').hide($('#test').text());
            var x = JSON.parse($('#test').text());
            console.log(x);
            // 语音播报
            var html = $("<audio autoplay=\'autoplay\'><source src=\'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text=" + "买单返成功收款  " + x.prices + "元！" + "\' type=\'audio/mpeg\'></audio>");
            $('.tittle').append(html);
            // 添加订单
            $('#mes').empty();
            $('#item').prepend('<tr> ' +
                '<td style="padding-left: 50px" class="am-text-middle"></td> ' +
                '<td class="am-text-middle"> ' +
                '<ul> ' +
                '<li>商品名称：&nbsp' + x.goods_name + '</li> ' +
                '<li id="money">订单金额：&nbsp' + x.prices + '</li> ' +
                '<li>订单时间: &nbsp' + new Date(parseInt(x.pay_time) * 1000).toLocaleString().substr(9) + '</li> ' +
                '<li>支付类型:&nbsp ' + pay_style[x.pay_type] + '</li>' +
                '<li>订单编号：&nbsp' + x.order_no + '</li> ' +
                '</ul> ' +
                '</td> ' +
                '</tr>');
            $($("#item").find("tr td").first()).text($('#item tr').length);
        }
    });


});
