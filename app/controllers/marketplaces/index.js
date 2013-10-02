Balanced.MarketplacesIndexController = Balanced.ArrayController.extend(Ember.Evented, {
	needs: ['application', 'notification'],
	actions: {
		promptToDeleteMarketplace: function(marketplace) {
			this.trigger('openDeleteMarketplaceModal', marketplace);
		}
	}
});
