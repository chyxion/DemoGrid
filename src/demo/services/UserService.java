package demo.services;
import com.shs.framework.core.BaseService;
import com.shs.framework.core.ExtStore;

public class UserService extends BaseService {
	public ExtStore list() {
		return new ExtStore(dao, params) {
			@Override
			protected void run() throws Exception {
				setSQL("select id, name, gender from users");
				orderBy("name", ASC);
			}
		};
	}
}
