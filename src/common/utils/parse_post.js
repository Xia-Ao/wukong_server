
// 解析上下文里node原生请求的POST参数
const parsePostData = (ctx) => {
    return new Promise((resolve, reject) => {
        try {
            let postdata = "";
            ctx.req.addListener('data', (data) => {
                postdata += data
            })
            ctx.req.addListener("end", function () {
                console.log('end');
                let parseData = _parseQueryStr(postdata)
                resolve(parseData)
            })
        } catch (err) {
            reject(err)
        }
    })
};

// 将POST请求参数字符串解析成JSON
const _parseQueryStr = (queryStr) => {
    let queryData = {};
    let queryStrList = queryStr.split('&');
    console.log(queryStrList)
    for (let [index, queryStr] of queryStrList.entries()) {
        let itemList = queryStr.split('=');
        queryData[itemList[0]] = decodeURIComponent(itemList[1]);
    }
    return queryData;
}

module.exports = {
    parsePostData,
}