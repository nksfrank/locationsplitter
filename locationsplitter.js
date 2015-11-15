/* global $ */
Array.prototype.not = function(callback) {
	return this.filter(function() {
		return !callback.apply(this, arguments);
	});
}

var UrlBreaker = function() {
	var self = this;
	this.Settings = {
		FILTER_FLAG: 'f=1',
		HASH_ID: 'key',
		HASH_VALUE: 'value',
		SEARCH_FLAG: 'f=1',
		SEARCH_ID: 'key',
		SEARCH_VALUE: 'value'
	}
	
	var createObj = function(key, value) {
		return function(prev, curr) {
			prev = prev || [];
			var obj = {}
			obj[key] = curr[0];
			obj[value] = curr[1];
			prev.push(obj);
			return prev;
		}
	}
	
	var split = function(c) {
		return function(item) {
			if(Array.isArray(item) && item[1].indexOf(c) > -1) {
				return item.map(split(c));
			}
			else if(item != null && item.indexOf(c) > -1) {
				return item.split(c);
			}
			return item;
		}
	}
	
	var isFlag = function(flag) {
		return function(item, index) {
			return item != null && item === flag;
		}
	}
	
	this.GetHash = function(hash) {
		return (hash.indexOf('#') > -1 ? hash.substring(1): hash)
		.split('&')
		.not(isFlag(self.Settings.FILTER_FLAG))
		.map(split('='))
		.reduce(createObj(self.Settings.HASH_ID, self.Settings.HASH_VALUE), []);
	}
	
	this.GetSearch = function(search) {
		return (search.indexOf('?') > -1 ? search.substring(1) : search).split('&')
		.not(isFlag(self.Settings.SEARCH_FLAG))
		.map(split('='))
		.reduce(createObj(self.Settings.SEARCH_ID, self.Settings.SEARCH_VALUE), []);
	}
	
	this.GetQuery = function(query) {
		return this.GetSearch(query);
	}
	
	this.GetLocation = function(location) {
		return {
			'host': location.host,
			'pathname': location.pathname,
			'search': self.GetSearch(location.search),
			'hash': self.GetHash(location.hash),
			
		}
	}
}

$(function() {
	var ub = new UrlBreaker();
	var hash = JSON.stringify(ub.GetHash(window.location.hash), null, 2);
	var search = JSON.stringify(ub.GetSearch(window.location.search), null, 2);
	var query = JSON.stringify(ub.GetQuery(window.location.search), null, 2);
	var url = JSON.stringify(ub.GetLocation(window.location), null, 2);
	console.log(hash);
	console.log(search);
	console.log(query);
	console.log(url);
	
	$('#output').append(url);
});