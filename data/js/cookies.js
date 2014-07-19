/* Library extension
// Description: easy cookie management
// Dependencies: core.js
// zerokillex@gmail.com
*/
// query a value from an escape or unescape string pair name/value;
// UPDATED: July 21, 2009 0:12
// return an object with each identifier as property with actual value if any;
String.prototype.query = function(split, begin){ // if(!this.length)return undefined;
var split = split || ['&', '='], query = this, queryObj = {};
if(split.constructor != Array || split.length != 2)throw new TypeError('Excepted type of argument not valid or argument lenght size not allowed.');
if(begin)query = query.replace(begin, '');
query = query.split(split[0]);
	while(query.length){
	var pair = query.shift().split(split[1]);
		if(pair[0] in queryObj){
		if(queryObj[pair[0]].constructor != Array)queryObj[pair[0]] = new Array(queryObj[pair[0]]);
		queryObj[pair[0]].push(decodeURIComponent(pair[1]));
		}
		else queryObj[pair[0]] = (pair[1])? decodeURIComponent(pair[1]): undefined;
	}
return queryObj;
}

var Cookie = {
// path, hours, domain, and secure are optional arguments;
store: function(name, value, hours, path, domain, secure){
var date = new Date();
date.setHours(date.getHours() + hours);
var cookie = name + '=' + encodeURIComponent(value) + ';';
if(hours)cookie += 'expires=' + date.toGMTString() + ';';
if(path)cookie += 'path=' + path + ';';
if(domain)cookie += 'domain=' + domain + ';';
if(secure)cookie += 'secure';
return document.cookie = cookie;
},

query: function(){
return document.cookie.query([/;\s?/, '=']);
},

remove: function(name, path){
if(!path)path = '/';
	if(this.query(name)){
	this.store(name, '', -1, path);
	if(!this.query(name))return true;
	}
return false;
}
}
