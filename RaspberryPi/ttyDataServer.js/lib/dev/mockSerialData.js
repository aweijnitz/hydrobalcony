var data = ['ll:213', 'wl:154', 'ap:1013', 'at:2312', 'wt:1800', 'pc:-38', 'hb:472986000', 'wl:260'];
var nextIndex = 0;

var mockData = function () {
    return data[nextIndex++ % data.length];
};

exports = module.exports = mockData;
