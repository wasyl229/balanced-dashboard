Balanced.NotificationController = Ember.Controller.extend({
	notificationQueue: [],
	currentNotificationIndex: 0,
	shownNotificationCenter: true,

	init: function() {
		var self = this;
		this.populateNotificationQueue = _.bind(this.populateNotificationQueue, this);

		Balanced.Notifications.on('notificationListUpdate', function() {
			self.set('notificationQueue', Balanced.Notifications.get('notifications'));
		});

		this.populateNotificationQueue();
		Balanced.Auth.on('signInSuccess', this.populateNotificationQueue);
		Balanced.Auth.on('signOutSuccess', this.populateNotificationQueue);
	},

	showNotificationCenter: function() {
		return this.get('hasNotifications') && this.get('shownNotificationCenter');
	}.property('shownNotificationCenter', 'hasNotifications'),

	hasNotifications: function() {
		return (this.get('notificationQueue') || []).length > 0;
	}.property('notificationQueue'),

	hasMoreThanOneNotification: function() {
		return this.get('notificationQueue').length > 1;
	}.property('notificationQueue'),

	populateNotificationQueue: function() {
		Balanced.Notifications.listNotifications();

		if (Balanced.Auth.isGuest) {
			this.set('shownNotificationCenter', true);
		}
	},

	currentIndex: function() {
		return this.get('currentNotificationIndex') + 1;
	}.property('currentNotificationIndex'),

	numNotifications: function() {
		return (this.get('notificationQueue') || []).length;
	}.property('notificationQueue'),

	currentNotification: function() {
		var currentNotificationIndex = this.get('currentNotificationIndex');

		var notificationQueue = this.get('notificationQueue') || [];

		return notificationQueue[currentNotificationIndex].message;
	}.property('notificationQueue', 'currentNotificationIndex'),

	actions: {
		closeNotificationCenter: function() {
			this.set('shownNotificationCenter', false);

			Balanced.Notifications.deleteAll();
		},

		toggleNotificationCenter: function() {
			this.set('shownNotificationCenter', !this.get('shownNotificationCenter'));
		},

		nextNotification: function() {
			var currentNotificationIndex = this.get('currentNotificationIndex');

			var notificationQueue = this.get('notificationQueue') || [];

			currentNotificationIndex += 1;

			if (currentNotificationIndex >= notificationQueue.length) {
				currentNotificationIndex = 0;
			}

			this.set('currentNotificationIndex', currentNotificationIndex);
		},

		previousNotification: function() {
			var currentNotificationIndex = this.get('currentNotificationIndex');

			var notificationQueue = this.get('notificationQueue') || [];

			currentNotificationIndex -= 1;

			if (currentNotificationIndex < 0) {
				currentNotificationIndex = notificationQueue.length - 1;
			}

			this.set('currentNotificationIndex', currentNotificationIndex);
		}
	}
});
