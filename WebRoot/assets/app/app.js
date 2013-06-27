Ext.Loader.setPath ('App', 'assets/app');
Ext.onReady (function () {
 	Ext.create('Ext.Viewport', {
		layout: 'border',
      	items: [{
             xtype: 'box',
             region: 'north',
             height: 64,
             html: 'here is header!'
      	}, {
			region: 'center',
			xtype: 'tabpanel',
			resizeTabs: true,
			enableTabScroll: true,
			defaults: {
				margins: '-1',
				border: false
			},
			flex: 1,
			margins: '1 0',
			items: [{
				title: 'tab 1'
			}, Ext.create('App.views.user.UsersGrid', {
				title: 'users list'	
			})]
		}, {
             xtype: 'box',
             region: 'south',
             style: 'padding-top: 4px;',
             height: 36,
             html: '&#169; 2013 '
        }]
    });
});
