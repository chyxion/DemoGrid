Ext.define ('App.views.user.UsersGrid', {
    extend: 'App.views.commons.Grid',
    paging: true,
    store: Store.create({
        autoLoad: true,
        pageSize: 1,
        url: 'user/list',
        fields: ['id', 'name', 'gender']
    }),
    columns: [{
        xtype: 'rownumberer'
    },{
        dataIndex: 'name',
        text: '名称',
        flex: 1
    },{
        dataIndex: 'gender',
        text: '性别',
        width: 32
    }]
});