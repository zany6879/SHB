/**
 * Created by Administrator on 2017/4/21.
 */
$().ready(function() {
    // 验证是否能登录
    if($("#password").val().length<4){
        $("#login").attr("disabled",true);
    }else{
        $("#login").attr("disabled",false);
    }
    $("#password").on("input propertychange",function () {
        if($("#password").val().length<4){
            $("#login").attr("disabled",true);
        }else{
            $("#login").attr("disabled",false);
        }
    });
    // 登录
    $("#login").click(function () {
        var tel = $("#tel").val();
        var password = $("#password").val();
        var code = {name:tel,password:password};
            $.ajax({
                url: 'http://t.maidanfanli.com/NoteApp/Login/login',
                data: code,
                type: 'POST',
                dataType:'json',
                success: function(result) {
                    console.log(result);
                    if(result.status==1){
                        console.log(result.data);
                        localStorage.setItem('tel',tel);
                        swal({
                            title: '登录成功！',
                            type: 'success',
                            showConfirmButton: false
                        });
                        localStorage.setItem('mid',result.data);
                        setTimeout(function () {
                            location.href="../index.html";
                        }, 1000);
                    }else{
                        swal('账号或者密码错误！')
                    }
                },
                error:function(er){
                    swal('连接失败请重试！');
                }
            });

    });

});