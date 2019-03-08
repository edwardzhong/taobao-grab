
$('#lbtn').on('click', function (e) {
    var val = $('#link').val();
    var btn = this;
    if (!val) return;
    if (!/id\=([^?=&]+)/.test(val)) {
        alert('url 格式不正确');
        return;
    }
    btn.disabled=true;
    $.ajax({
        url: '/info',
        type: 'GET',
        data: { id: RegExp.$1 },
        success: function (data) {
            btn.disabled=false;
            $('.info').text('发货地：' + data.city + ' 价格：' + data.price)
            console.log(data);
        },
        error:function(){
            btn.disabled=false;
        }
    })
});

$('#rbtn').on('click', function (e) {
    var val = $('#kw').val();
    var btn = this;
    if (!val) return;
    btn.disabled=true;
    $.ajax({
        url: '/rank',
        type: 'GET',
        timeout: 30000,
        data: { kw: val },
        success: function (data) {
            btn.disabled=false;
            console.log(data);
            var maps = data.map(function (item, i) {
                return '<p>' + (i+1) + '. ' + item.title + ' price: ' + item.price + ' shop:' + item.shop + '</p>';
            });
            $('.rank').html(maps.join(''));
        },
        error:function(){
            btn.disabled=false;
        }
    })
});