package demo.controllers;

import com.shs.framework.core.BaseController;
import demo.services.UserService;
public class UserController extends BaseController {
	private UserService service;
	public void list() {
		success(service.list());
	}
}
