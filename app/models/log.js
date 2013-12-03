Balanced.Log = Balanced.Model.extend({
	uri: '/logs',

	short_url: function() {
		return Balanced.Utils.stripDomain(this.get('message.request.url'));
	}.property('message.request.url'),

	link_to_url: function() {
		return this.get('message.request.url');
	}.property('message.request.url'),

	condensed_request_url: function() {
		return Balanced.Utils.prettyLogUrl(this.get('short_url'));
	}.property('log.short_url'),

	geo_ip: function() {
		var ip = this.get('message.request.headers.X-Real-Ip');

		if (ip) {
			var self = this;

			Balanced.Utils.geoIP(ip, function(result) {
				self.set('geo_ip', result);
			});
		}
	}.property('message.request.headers.X-Real-Ip'),

	request_payload: function() {
		return this.linkify('message.request.payload');
	}.property('message.request.payload'),

	response_body: function() {
		return this.linkify('message.response.body');
	}.property('message.response.body'),

	linkify: function(k) {
		var c = this.get(k);
		var hash = {
			customer: function (customerId, key) {
				return 'customers/' + customerId;
			},
			owner_customer: function (customerId, key) {
				return 'customers/' + customerId;
			},
		};

		function isObject(obj) {
			var newObj = {};

			_.each(obj, function(val, key) {
				if (hash[key]) {
					newObj[key] = '<a href="'+ hash[key](val, key) + '">' + val + '</a>';
				} else if (_.isObject(val)) {
					newObj[key] = isObject(val);
				} else {
					newObj[key] = val;
				}
			});

			return newObj;
		};

		return isObject(c);
	}
});

Balanced.TypeMappings.addTypeMapping('log', 'Balanced.Log');
Balanced.TypeMappings.addTypeMapping('log_search', 'Balanced.Log');
