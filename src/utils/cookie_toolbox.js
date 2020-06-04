const cookieToolbox = {
    // 设置cookie方法
    set: (key, val, time) => {
        const date = new Date();
        const expiresDays = time;
        // date.setTime(date.getTime() + (expiresDays * 24 * 3600 * 1000)); // 多少天后失效
        date.setTime(date.getTime() + (expiresDays * 3600 * 1000)); // expiresDays  多少小时后失效
        document.cookie = key + '=' + val + ';path=/;expires=' + date.toGMTString();
    },
    // 获取cookie方法
    get: (key, get) => {
        const cookies = document.cookie.split('; ').find((item) => {
            return item.indexOf(key + '=') > -1;
        });
        if (get === 'get') {
            return cookies ? cookies.substring(10) : '';
        }
        return cookies ? cookies.split('=')[1] : '';
    },
    // 删除cookie方法
    delete: (key) => {
        const date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = key + '=' + cookieToolbox.get(key) + ';path=/;expires=' + date.toGMTString();
    },
};

export default cookieToolbox;
