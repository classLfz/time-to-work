(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"154":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{"value":!0});var a,n=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),o=r(6),i=_interopRequireDefault(o),l=_interopRequireDefault(r(0)),u=r(31),s=r(158),c=r(32),f=r(173),d=r(165),p=(_interopRequireDefault(r(251)),_interopRequireDefault(r(250))),m=_interopRequireDefault(r(172)),h=_interopRequireDefault(r(249));function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}r(244),t.default=(0,c.connect)(function(e){return{"team":e.team,"staff":e.staff}},function(e){return{"onUpdateTeamMap":function onUpdateTeamMap(t){e((0,f.updateTeamMap)(t))},"onUpdateStaffMap":function onUpdateStaffMap(t){e((0,d.updateStaffMap)(t))}}})(a=function(e){function Index(e){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,Index);var t=function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(Index.__proto__||Object.getPrototypeOf(Index)).call(this,e));return t.config={"navigationBarTitleText":"分配工作","navigationBarBackgroundColor":"#5E35B1","navigationBarTextStyle":"white"},t.entryHistory=function(){i.default.navigateTo({"url":"/pages/history/history"})},t.decideToAllot=function(e){e.stopPropagation();var r=t.state.allotIntervalTime;if(0!==r){var a=i.default.getStorageSync("history")||{};if(0===Object.keys(a).length)return void t.allot();var n=(new Date).getTime(),o=Object.keys(a).sort(function(e,t){return parseInt(t)-parseInt(e)});if(parseInt(o[0])+r>n)return void i.default.showModal({"title":"警告","content":"未超过限制时间，是否强制进行分配","success":function success(e){e.confirm&&t.allot()}});t.allot()}else t.allot()},t.allot=function(){var e=t.props,r=e.team,a=e.staff,n=JSON.parse(JSON.stringify(r.teamMap)),o=JSON.parse(JSON.stringify(a.staffMap)),l=(0,p.default)(n,o);"error"!==l.type?i.default.showLoading({"title":"分配任务中...","mask":!0}).then(function(){setTimeout(function(){i.default.hideLoading(),t.setState({"teamAlloted":l.teamMap}),t.state.allotAndArchive&&setTimeout(function(){t.archive()},0),t.state.allotAndCopy&&setTimeout(function(){t.copy()},500),i.default.showToast({"title":"分配工作完成","icon":"success"})},1e3)}):i.default.showToast({"title":l.message,"icon":"none"})},t.reset=function(){t.setState({"teamAlloted":{}})},t.copy=function(){var e=t.state.teamAlloted;if(Object.keys(e).length<=0)i.default.showToast({"title":"请先进行分配","icon":"none"});else{var r="分配好工作了：\n";for(var a in e){var n=e[a];r+="\n#\n团队："+a+"\n",n.needLeader&&(r+="负责人："+(n.leader||"")+"\n");var o=n.jobs;for(var l in o){var u=o[l];r+="职位："+l+"（"+u.num+"人）：",u.workers.forEach(function(e){r+=e+"，"}),r.replace("，",""),r+="\n"}}i.default.setClipboardData({"data":r})}},t.archive=function(){var e=t.state.teamAlloted;if(0!==Object.keys(e).length){var r=new Date,a=i.default.getStorageSync("history")||{};a[r.getTime()]=e,i.default.setStorageSync("history",a),i.default.showToast({"title":"归档成功","icon":"success"})}else i.default.showToast({"title":"请先进行分配","icon":"none"})},t.state={"firstUpdated":!1,"teamAlloted":{},"intervalMap":{"一天":86400,"半天":43200,"一小时":3600,"不限制":0},"allotIntervalTime":0,"allotAndCopy":!1,"allotAndArchive":!1},t}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{"constructor":{"value":e,"enumerable":!1,"writable":!0,"configurable":!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(Index,o.Component),n(Index,[{"key":"componentDidShow","value":function componentDidShow(){var e=this.props,t=e.onUpdateTeamMap,r=e.onUpdateStaffMap,a=i.default.getStorageSync("teams")||{},n=i.default.getStorageSync("staff")||{};this.state.firstUpdated||(t(a),r(n),this.setState({"firstUpdated":!0}));var o=i.default.getStorageSync("allotAndCopy"),l=i.default.getStorageSync("allotAndArchive"),u=i.default.getStorageSync("allotInterval")||"不限制";this.setState({"allotAndCopy":o,"allotAndArchive":l,"allotIntervalTime":this.state.intervalMap[u]})}},{"key":"render","value":function render(){var e=this.state.teamAlloted,t=0!==Object.keys(e).length,r=Object.keys(e).map(function(t){return l.default.createElement(m.default,{"teamData":e[t],"key":t.name,"justShow":!0})});return l.default.createElement(u.View,{"className":"index-container"},l.default.createElement(u.View,{"className":"index-header"},l.default.createElement(u.View,{"onClick":this.entryHistory},l.default.createElement(s.AtIcon,{"value":"star-2","size":"24","color":"#FFFFFF"}))),l.default.createElement(u.View,{"className":"content"},l.default.createElement(u.View,{"hidden":t},l.default.createElement(h.default,null)),l.default.createElement(u.View,{"hidden":!t},r)),l.default.createElement(u.View,{"className":"operator-box"},l.default.createElement(u.View,{"className":"operator"},l.default.createElement(u.View,{"className":"icon-btn","onClick":this.decideToAllot},l.default.createElement(s.AtIcon,{"value":"play","size":"40","color":"#0D47A1"})),l.default.createElement(u.View,{"className":"icon-btn","onClick":this.reset},l.default.createElement(s.AtIcon,{"value":"stop","size":"40","color":"#004D40"})),"",l.default.createElement(u.View,{"className":"icon-btn","onClick":this.archive},l.default.createElement(s.AtIcon,{"value":"star","size":"40","color":"#C51162"})))))}},{"key":"componentDidMount","value":function componentDidMount(){}}]),Index}())||a},"157":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{"value":!0}),t.naturalSort=function naturalSort(e,t){var r,a,n=/(^([+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|^0x[\da-fA-F]+$|\d+)/g,o=/^\s+|\s+$/g,l=/\s+/g,u=/^0x[0-9a-f]+$/i,s=/^0/,c=function i(e){return(naturalSort.insensitive&&(""+e).toLowerCase()||""+e).replace(o,"")},f=c(e),d=c(t),p=f.replace(n,"\0$1\0").replace(/\0$/,"").replace(/^\0/,"").split("\0"),m=d.replace(n,"\0$1\0").replace(/\0$/,"").replace(/^\0/,"").split("\0"),h=parseInt(f.match(u),16)||1!==p.length&&Date.parse(f),v=parseInt(d.match(u),16)||h&&d.match(/(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/)&&Date.parse(d)||null,y=function normChunk(e,t){return(!e.match(s)||1==t)&&parseFloat(e)||e.replace(l," ").replace(o,"")||0};if(v){if(h<v)return-1;if(h>v)return 1}for(var b=0,g=p.length,_=m.length,w=Math.max(g,_);b<w;b++){if(r=y(p[b]||"",g),a=y(m[b]||"",_),isNaN(r)!==isNaN(a))return isNaN(r)?1:-1;if(/[^\x00-\x80]/.test(r+a)&&r.localeCompare){var k=r.localeCompare(a);return k/Math.abs(k)}if(r<a)return-1;if(r>a)return 1}},t.formatTime=function formatTime(e){if(!e)return"";var t=new Date(e);if(!t)return"";var r=t.getFullYear(),n=t.getMonth()+1,o=t.getDate(),i=t.getHours(),l=t.getMinutes(),u=t.getSeconds();return[r,n,o].map(a).join("-")+" "+[i,l,u].map(a).join(":")};var a=function formatNumber(e){return(e=e.toString())[1]?e:"0"+e}},"165":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{"value":!0}),t.updateStaffMap=void 0;var a=_interopRequireDefault(r(6)),n=(_interopRequireDefault(r(0)),r(157)),o=r(33);function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}t.updateStaffMap=function updateStaffMap(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t={};return Object.keys(e).sort(n.naturalSort).forEach(function(r){t[r]=e[r]}),a.default.setStorageSync("staff",t),{"type":o.UPDATE_STAFF_MAP,"data":t}}},"171":function(e,t,r){},"172":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{"value":!0}),t.default=void 0;var a=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),n=r(6),o=_interopRequireDefault(n),i=_interopRequireDefault(r(0)),l=r(31),u=r(158);function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}r(171);var s=function(e){function TeamCard(e){!function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,TeamCard);var t=function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(TeamCard.__proto__||Object.getPrototypeOf(TeamCard)).call(this,e));return t.entryEdit=function(){t.props.justShow||o.default.navigateTo({"url":"/pages/teamEdit/teamEdit?teamName="+t.props.teamData.name})},t}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{"constructor":{"value":e,"enumerable":!1,"writable":!0,"configurable":!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(TeamCard,n.Component),a(TeamCard,[{"key":"render","value":function render(){var e=this.props.teamData||{},t=e.jobs||{},r=[];for(var a in t)r.push(Object.assign({"name":a},t[a]));var n=r.map(function(e){var t=e.workers.map(function(e){return i.default.createElement(l.Text,{"className":"worker-card","key":e},e)});return i.default.createElement(l.View,{"key":e.name,"className":"team-item"},i.default.createElement(l.Text,null,e.name),i.default.createElement(l.Text,null," (",e.num,"人)："),t)});return i.default.createElement(l.View,{"className":"team-card-container","onClick":this.entryEdit},i.default.createElement(u.AtCard,{"title":e.name,"extra":e.leader},n))}}]),TeamCard}();t.default=s},"173":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{"value":!0}),t.updateTeamMap=void 0;var a=_interopRequireDefault(r(6)),n=(_interopRequireDefault(r(0)),r(157)),o=r(34);function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}t.updateTeamMap=function updateTeamMap(e){var t={};return Object.keys(e).sort(n.naturalSort).forEach(function(r){t[r]=e[r]}),a.default.setStorageSync("teams",t),{"type":o.UPDATE_TEAM_MAP,"data":t}}},"244":function(e,t,r){},"246":function(e,t,r){},"248":function(e,t,r){},"249":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{"value":!0});var a,n=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}(),o=r(6),i=(_interopRequireDefault(o),_interopRequireDefault(r(0))),l=r(31),u=r(32);function _interopRequireDefault(e){return e&&e.__esModule?e:{"default":e}}r(248),t.default=(0,u.connect)(function(e){return{"team":e.team,"staff":e.staff}})(a=function(e){function IntroCard(e){return function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,IntroCard),function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(IntroCard.__proto__||Object.getPrototypeOf(IntroCard)).call(this,e))}return function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{"constructor":{"value":e,"enumerable":!1,"writable":!0,"configurable":!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(IntroCard,o.Component),n(IntroCard,[{"key":"render","value":function render(){var e=this.props.team.teamMap||{},t=this.props.staff.staffMap||{};return i.default.createElement(l.View,null,i.default.createElement(l.View,{"className":"count-item"},i.default.createElement(l.Text,null,"总团队数"),i.default.createElement(l.Text,null,Object.keys(e).length)),i.default.createElement(l.View,{"className":"count-item"},i.default.createElement(l.Text,null,"总职员数"),i.default.createElement(l.Text,null,Object.keys(t).length)))}}]),IntroCard}())||a},"250":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{"value":!0}),t.default=function(e,t){if(0===Object.keys(e).length)return{"type":"error","message":"请先添加团队"};var r=JSON.parse(JSON.stringify(t));for(var a in t)(t[a].rest||t[a].leave)&&delete t[a];if(0===Object.keys(t).length)return{"type":"error","message":"暂无职员可以分配"};for(var n in e)if(!e[n].rest){e[n].needLeader&&e[n].leader&&!e[n].leaderWork&&delete t[e[n].leader];var o=e[n].jobs;for(var i in o)o[i].workers.forEach(function(e){delete t[e]}),o[i].cheatWorkers&&o[i].cheatWorkers.forEach(function(e){delete t[e]})}for(var l in e){if(e[l].needLeader&&!e[l].leader){var u=Object.keys(t),s=parseInt(Math.random()*u.length);e[l].leader=u[s],e[l].leaderWork||delete t[u[s]]}var c=e[l].jobs;if(!e[l].rest)for(var f in c)if(!(c[f].rest||c[f].num<=c[f].workers.length))for(var d=0;c[f].num>c[f].workers.length;){var p=c[f].cheatWorkers;if(p&&p.length>0&&p[d]&&r[p[d]]&&!r[p[d]].rest&&!r[p[d]].leave)c[f].workers.push(p[d]),d++;else{var m=Object.keys(t);if(m.length<=0)break;var h=parseInt(Math.random()*m.length);m[h]&&(c[f].workers.push(m[h]),delete t[m[h]])}}}for(var v in e)e[v].rest&&delete e[v];return{"type":"success","teamMap":e}}},"251":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{"value":!0}),t.default=function resolveClipboardData(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};/^分配工作[(|（]清空[)|）]/.test(e)&&(t={},r={});for(var a=e.split(/\s#/),n=function _loop(e){var n=a[e].trim().split(/\n|\r/),o={"jobs":{},"workers":{}};n.forEach(function(e){var t=e.split(/:|：/);if(t&&!(t.length<=1))switch(t[0].replace(/:|：/,"")){case"团队":o.name=t[1];break;case"负责人":o.leader=t[1],r[t[1]]={"rest":!1,"leave":!1};break;case"职位":var a=t[1].split(/\*/),n={},i=[];a.splice(2).forEach(function(e){n[e.trim()]={"rest":!1,"leave":!1},i.push(e.trim())}),o.jobs[a[0].trim()]={"num":parseInt(a[1].trim()),"rest":!1,"workers":i},r=Object.assign(r,n)}}),t[o.name]=o},o=1;o<a.length;o++)n(o);var i=e.split(/\@人员[:|：]/)[1]||"";if(!i)return[t,r];return i.split(/[,|，]/).forEach(function(e){r[e.trim()]={"rest":!1,"leave":!1}}),[t,r]}}}]);