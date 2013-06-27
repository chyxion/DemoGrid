<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html>
  <head>
    <base href="<%=basePath%>">
    <title>index</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
  <%--EXT资源--%>
	<link rel="stylesheet" type="text/css" href="assets/commons/ext/resources/css/ext-all.css" />
	<script type="text/javascript" src="assets/commons/ext/ext-all.js"></script>
  <%--中文包--%>
	<script type="text/javascript" src="assets/commons/ext/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript">
	    // 动态加载
	    Ext.Loader.setConfig({enabled: true});
	    Ext.Loader.setPath('Ext', 'assets/commons/ext/src');
	    Ext.Loader.setPath('Ext.ux', 'assets/commons/ext/ux');
	    // 空白图表URL
	    Ext.BLANK_IMAGE_URL = 'assets/commons/ext/resources/s.gif';
	    // grid行编辑器文字
	    Ext.grid.RowEditor.prototype.saveBtnText = '保存';
	    Ext.grid.RowEditor.prototype.cancelBtnText = '取消';
	    // Ext 4.2 bug
	    Ext.tip.Tip.prototype.minWidth = 320;
	</script>
	<script type="text/javascript" src="assets/commons/js/commons.js"></script>
	<link rel="stylesheet" type="text/css" href="assets/commons/css/styles.css" />
  <script type="text/javascript" src="assets/app/app.js"></script>
  </head>
  <body>
    <%--消息提示--%>
    <div id="message-div" style="z-index: 30240;"></div>
  </body>
</html>
