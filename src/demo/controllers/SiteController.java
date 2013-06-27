package demo.controllers;
import com.shs.framework.aop.RouteMapping;
import com.shs.framework.core.BaseController;

@RouteMapping(controller="/")
public class SiteController extends BaseController {
	public void index() {
		jsp("/index");
	}
}
