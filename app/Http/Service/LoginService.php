<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/9
 * Time: 下午10:51
 */

namespace App\Http\Service;


use App\Http\Common\Util\ResponseUtil;
use App\Http\Dao\AccountDAO;
use Exception;

class LoginService
{
    private $accountDAO;

    public function __construct(AccountDAO $accountDAO)
    {
        $this->accountDAO = $accountDAO;
    }

    public function checkLogin($data)
    {
        $account = $this->accountDAO->findDataInfo([
            'account_name' => $data['account_name'],
            'is_available' => 1
        ], ['account_id', 'password']);

        if ($account == null) {
            return ResponseUtil::errorMsg("账号不存在或被冻结，请联系管理员");
        }

        if ($account->password != $data['password']) {
            return ResponseUtil::errorMsg("账号或密码错误");
        }

        // todo 无权限账号无法登录

        session("auth_account_id", $account->account_id);

        $this->accountDAO->updateDataInfo(['last_login_time' => date("Y-m-d H:i:s")],
            ['account_id' => $account->account_id]);

        return ResponseUtil::successMsg("登录成功！");
    }
}