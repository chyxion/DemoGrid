/**
 * @describe: 通用grid
 * @version 0.1
 * @date created: 3/19/2013 10:27:17 
 * @author chyxion
 * @support: chyxion@163.com
 * @date modified: 
 * @modified by: 
 */
Ext.define('App.views.commons.Grid', {
    extend:'Ext.grid.Panel',
    alias: 'widget.cgrid',
    columnLines: true,
    selModel: {  // 默认多选
        mode:　'MULTI',
        allowDeselect: true
    },
    initComponent: function() {
        var me = this;
          // 分页
          me.paging && (me.bbar = me.build_paging_bbar());
          // store
          me.store = me.get_store();
          me.callParent();
    },
    get_store: function() { // 生成store，private
        var me = this, s;
        if (!me._store) {
          s = me.store || me.build_store();
          me.paging && me.page_size && (s.pageSize = me.page_size);
          me._store = s.isStore ?  s : Ext.create('Ext.data.Store', s);
        }
        return me._store;
    },
    build_paging_bbar: function () { // 返回分页bbar
        return Ext.widget('pagingtoolbar', {
            store: this.get_store(),
            displayInfo: true,
            displayMsg: this.no_total ? 
                '当前数据： {0} - {1}' : 
                '当前数据： {0} - {1}， 总共： {2}',
            emptyMsg: '没有显示数据'
        });
    }
});
