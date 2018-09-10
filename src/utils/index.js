/**
 * 使用`javascript-natural-sort`库进行排序
 * @param {String|Number} a 排序元素1
 * @param {String|Number} b 排序元素2
 */
export function naturalSort (a, b) {
  var re = /(^([+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|^0x[\da-fA-F]+$|\d+)/g,
      sre = /^\s+|\s+$/g,   // trim pre-post whitespace
      snre = /\s+/g,        // normalize all whitespace to single ' ' character
      dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
      hre = /^0x[0-9a-f]+$/i,
      ore = /^0/,
      i = function(s) {
          return (naturalSort.insensitive && ('' + s).toLowerCase() || '' + s).replace(sre, '');
      },
      // convert all to strings strip whitespace
      x = i(a),
      y = i(b),
      // chunk/tokenize
      xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
      yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
      // numeric, hex or date detection
      xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x)),
      yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
      normChunk = function(s, l) {
          // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
          return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
      },
      oFxNcL, oFyNcL;
  // first try and sort Hex codes or Dates
  if (yD) {
      if (xD < yD) { return -1; }
      else if (xD > yD) { return 1; }
  }
  // natural sorting through split numeric strings and default strings
  for(var cLoc = 0, xNl = xN.length, yNl = yN.length, numS = Math.max(xNl, yNl); cLoc < numS; cLoc++) {
      oFxNcL = normChunk(xN[cLoc] || '', xNl);
      oFyNcL = normChunk(yN[cLoc] || '', yNl);
      // handle numeric vs string comparison - number < string - (Kyle Adams)
      if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
          return isNaN(oFxNcL) ? 1 : -1;
      }
      // if unicode use locale comparison
      if (/[^\x00-\x80]/.test(oFxNcL + oFyNcL) && oFxNcL.localeCompare) {
          var comp = oFxNcL.localeCompare(oFyNcL);
          return comp / Math.abs(comp);
      }
      if (oFxNcL < oFyNcL) { return -1; }
      else if (oFxNcL > oFyNcL) { return 1; }
  }
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
/**
 * 时间展示，以`-`分隔
 * @param {Number|String|Date} 时间戳
 * @returns {String} 以`-`分割的时间字符串
 */
export function formatTime(date) {
    if (!date) return ''
    let dateFormat = new Date(date)
    if (!dateFormat) return ''
    const year = dateFormat.getFullYear()
    const month = dateFormat.getMonth() + 1
    const day = dateFormat.getDate()
    const hour = dateFormat.getHours()
    const minute = dateFormat.getMinutes()
    const second = dateFormat.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
