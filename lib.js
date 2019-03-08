const http = require('https');
const qs = require('querystring');
const cheerio = require('cheerio')

/**
 * http request post
 * @param  {Object} form 
 */
function request(opt) {
    const options = Object.assign({}, {
        hostname: '127.0.0.1',
        port: 443,
        path: '/',
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://item.taobao.com/item.htm',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        }
    }, opt);
    let body = '';

    return new Promise((resolve, reject) => {
        const req = http.request(options, res => {
            res.setEncoding('utf8');
            res.on('data', chunk => {
                body += chunk;
            });
            res.on('end', () => {
                resolve(body);
            });
        });

        req.on('error', err => {
            reject(err)
        });

        // post form
        // req.write(postData);
        req.end();
    });
}

exports.infoReq = async (id) => {
    const content = await request({
        hostname: 'detailskip.taobao.com',
        path: '/service/getData/1/p1/item/detail/sib.htm?' + qs.stringify({
            itemId: id,
            modules: 'price,delivery'
        })
    });
    let city = '', price = '';
    if (content) {
        const cityMatchs = content.match(/sendCity\":\"([^\:\"\,]+)\"/);
        const priceMatchs = content.match(/price\":\"([^\:\"\,]+)\"/);
        if (cityMatchs && cityMatchs[1]) {
            city = unescape(cityMatchs[1].replace(/\\/g,'%'));
        }
        if (priceMatchs && priceMatchs[1]) {
            price = priceMatchs[1];
        }
    }
    return { city, price };
}

// https://h5api.m.taobao.com/h5/mtop.alimama.union.sem.landing.pc.items/1.0/?jsv=2.4.0&appKey=12574478&t=1551987232157&sign=88eb9fbea08fd652b70bfb1574c4ac3a&api=mtop.alimama.union.sem.landing.pc.items&v=1.0&AntiCreep=true&dataType=jsonp&type=jsonp&ecode=0&callback=mtopjsonp1&data=%7B%22keyword%22%3A%22%E9%9E%8B%E5%AD%90%22%2C%22ppath%22%3A%22%22%2C%22loc%22%3A%22%22%2C%22minPrice%22%3A%22%22%2C%22maxPrice%22%3A%22%22%2C%22ismall%22%3A%22%22%2C%22ship%22%3A%22%22%2C%22itemAssurance%22%3A%22%22%2C%22exchange7%22%3A%22%22%2C%22custAssurance%22%3A%22%22%2C%22b%22%3A%22%22%2C%22clk1%22%3A%221d71f154c9607773b4d69636c472b7a7%22%2C%22pvoff%22%3A%22%22%2C%22pageSize%22%3A%22100%22%2C%22page%22%3A%220%22%2C%22elemtid%22%3A%221%22%2C%22refpid%22%3A%22mm_26632258_3504122_32538762%22%2C%22pid%22%3A%22430673_1006%22%2C%22featureNames%22%3A%22spGoldMedal%2CdsrDescribe%2CdsrDescribeGap%2CdsrService%2CdsrServiceGap%2CdsrDeliver%2C%20dsrDeliverGap%22%2C%22ac%22%3A%22olspEdNpqnQCARsm%2BGFEq%2BnM%22%2C%22wangwangid%22%3A%22%22%2C%22catId%22%3A%22%22%7D
// https://re.taobao.com/search?keyword=%E6%88%B7%E5%A4%96%E9%9E%8B&catid=50019272&refpid=mm_14507511_3485205_11375261&_input_charset=utf8&clk1=a7f6db98a82a42d48aa561201e689319&spm=a231k.7633877.0.0.1fa69bd43oAI0B
exports.rankReq = async kw => {
    const content = await request({
        hostname: 're.taobao.com',
        path: '/search?keyword=' + encodeURIComponent(kw)
    });
    const $ = cheerio.load(content, { decodeEntities: false });
    let arr = []
    $('#J_waterfallWrapper .item').each((i, item) => {
        arr.push({
            title: $(item).find('.title').attr('title'),
            price: $(item).find('.price strong').text(),
            shop: $(item).find('.shopNick').text()
        })
    })
    return arr;
    // console.log(content);
}

