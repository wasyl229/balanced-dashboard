Balanced.Notification = Balanced.Model.extend({
	uri: ENV.BALANCED.NOTIFICATIONS + '/notifications?email='
});

Balanced.TypeMappings.addTypeMapping('notification', 'Balanced.Notification');
