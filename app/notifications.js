Balanced.Notifications = (function() {
	var notifications = Ember.Object.create();

	notifications.listNotifications = function() {
		var self = this;

		if (!ENV.BALANCED.NOTIFICATIONS) {
			return;
		}

		if (!Balanced.Auth.user || !Balanced.Auth.user.email_address) {
			this.set('notifications', [{
				message: ' You\'re logged in as a temporary guest user. <a href="#/claim">Claim your account to save your data. &gt;</a>'
			}]);
			return;
		}

		return Balanced.NET.ajax({
			url: ENV.BALANCED.NOTIFICATIONS + 'notifications'
		}).done(function(response, status, jqxhr) {
			self.set('notifications', response.data || []);
		});
	};

	notifications.deleteAll = function() {
		this.deleteNotifications(_.compact(_.pluck(this.get('notifications'), 'id')));
	};

	notifications.deleteNotifications = function(notificationIds) {
		if (!notificationIds || !notificationIds.length) {
			return;
		}

		return _.each(notificationIds, _.bind(notifications.deleteNotification, notifications));
	};

	notifications.deleteNotification = function(notificationId) {
		var self = this;

		if (!ENV.BALANCED.NOTIFICATIONS) {
			return;
		}

		return Balanced.NET.ajax({
			url: ENV.BALANCED.NOTIFICATIONS + 'notification/' + notificationId,
			method: 'DELETE'
		});
	};

	return notifications;
}());
