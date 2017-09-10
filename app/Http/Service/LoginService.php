<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/10
 * Time: 上午9:15
 */

namespace App\Http\Service;


interface LoginService
{
    // 校验登录信息
    public function checkLogin($data);

    public function getMenuList($reqParam);

}