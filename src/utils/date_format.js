// 格式化时间
// type年月日
// HMS时分秒
export const formatTime = (timestamp, type) => {
    const time = new Date(timestamp * 1000);
    if (!timestamp || !time) {
        return '';
    }
    const addZero = (value) => {
        return (value < 10 ? '0' : '') + value;
    };
    const year = time.getFullYear();
    let month = time.getMonth() + 1;
    month = addZero(month);
    let day = time.getDate();
    day = addZero(day);
    let hour = time.getHours();
    hour = addZero(hour);
    let min = time.getMinutes();
    min = addZero(min);
    let sec = time.getSeconds();
    sec = addZero(sec);
    return type === 'YTD' ? `${year}-${month}-${day}` : type === 'HMS' ? `${hour}:${min}:${sec}` : `${year}-${month}-${day} ${hour}:${min}:${sec}`;
};

export const calcTimeDiff = (timestamp) => {
    if (!timestamp) {
        return '';
    }
    // 时间戳差
    let diff = (new Date().getTime() / 1000) - timestamp;
    // 根据 日、时、分 力度 计算
    // 日
    let day = Math.floor(diff / (60 * 60 * 24));
    if (day > 0) {
        return `${day}天前`;
    }
    diff = diff % (60 * 60 * 24);
    // 时
    let hour = Math.floor(diff / (60 * 60));
    if (hour > 0) {
        return `${hour}小时前`;
    }
    diff = diff % (60 * 60);
    // 分
    let min = Math.floor(diff / (60));
    if (min > 0) {
        return `${min}分钟前`;
    }
    return '刚刚';
};
