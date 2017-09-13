<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/9
 * Time: 下午10:51
 */

namespace App\Http\Service\Impl;


use App\Http\Common\Util\ResponseUtil;
use App\Http\Dao\AccountDAO;
use App\Http\Dao\ModuleDAO;
use App\Http\Dao\RoleDAO;
use App\Http\Service\LoginService;
use Exception;

class LoginServiceImpl implements LoginService
{
    private $accountDAO;
    private $moduleDAO;
    private $roleDAO;

    public function __construct(AccountDAO $accountDAO, ModuleDAO $moduleDAO, RoleDAO $roleDAO)
    {
        $this->accountDAO = $accountDAO;
        $this->moduleDAO = $moduleDAO;
        $this->roleDAO = $roleDAO;
    }

    public function checkLogin($data)
    {
        try {

            $account = $this->accountDAO->find([
                'account_name' => $data['account_name'],
                'is_available' => 1,
            ], ['account_id', 'password', 'account_name', 'belonged_organ_id', 'real_name']);

            if ($account == null) {
                return ResponseUtil::errorMsg("账号不存在或被冻结，请联系管理员");
            }

            if ($account->password != $data['password']) {
                return ResponseUtil::errorMsg("账号或密码错误");
            }

            $accountRoles = $this->accountDAO->selectUserRole($account);
            $accountOrgans = $this->roleDAO->findOrganIdByRole('r.role_id', $accountRoles->all());

            $accountModules = $this->roleDAO->findModuleIdByRole('rm.role_id', $accountRoles->all());

            // 无权限账号无法登录
            if ($accountRoles->count() == 0 || $accountModules->count() == 0) {
                return ResponseUtil::errorMsg("该账号未分配模块权限，请联系管理员");
            }
            session(["auth_account_cache" => (object)[
                'account_info'=>$account,
                'account_role_id'=>$accountRoles->all(),
                'account_organ_id'=>$accountOrgans->all(),
                'account_module_id'=>$accountModules->all()
            ]]);

            $this->accountDAO->update(['last_login_time' => date("Y-m-d H:i:s")],
                ['account_id' => $account->account_id]);

        } catch (Exception $e) {
            throw new Exception($e);
        }

        return ResponseUtil::successMsg("登录成功！");
    }

    public function getMenuList($reqParam)
    {
        $menuList = $this->moduleDAO->getModuleListByRoleId($reqParam,
            ['m.module_id', 'm.module_name', 'm.parent_module_id', 'm.module_url', 'm.display_level', 'is_visible'],
            ['role_id', session('auth_account_cache')->account_role_id],
            ['m.sort_no', 'desc']);

        foreach ($menuList as $k => &$menu) {
            $reqParam['parent_module_id'] = $menu->module_id;
            $reqParam['is_visible'] = $menu->is_visible;
            $menu->menu_two = $this->getMenuList($reqParam);
        }


        return $menuList;
    }

}