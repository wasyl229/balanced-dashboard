Balanced.Notifications = (function() {
	var notifications = Ember.Object.extend(Ember.Evented).create();

	notifications.listNotifications = function() {
		var self = this;

		if (!ENV.BALANCED.NOTIFICATIONS) {
			return;
		}

		if (!Balanced.Auth.user || !Balanced.Auth.user.email_address) {
			this.set('notifications', [' You\'re logged in as a temporary guest user. <a href="#/claim">Claim your account to save your data. &gt;</a>']);
			self.trigger('notificationListUpdate');
			return;
		}

		return Balanced.NET.ajax({
			url: ENV.BALANCED.NOTIFICATIONS + 'notifications?email=' + Balanced.Auth.user.email_address
		}).done(function(response, status, jqxhr) {
			self.set('notifications', response.data || []);
			self.trigger('notificationListUpdate');
		});
	};

	notifications.deleteAll = function() {
		this.deleteNotifications(_.pluck(this.get('notifications'), 'id'));
	};

	notifications.deleteNotifications = function(notificationIds) {
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
