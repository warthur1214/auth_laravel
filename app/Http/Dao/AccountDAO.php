<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/9
 * Time: 下午10:52
 */

namespace App\Http\Dao;


use App\Http\Dao\inter\AbstractRepository;
use App\Http\Dao\inter\BaseDAO;
use DB;
use Exception;

class AccountDAO extends AbstractRepository implements BaseDAO
{
    protected $table = "t_account as a";

    public function selectUserRole($account)
    {
        try {
            return $this->db()->where(['a.account_id'=>$account->account_id])
                ->leftJoin(
                    't_account_role_rel as ar',
                    'a.account_id',
                    '=',
                    'ar.account_id'
                )->pluck('role_id');
        } catch (\Exception $e) {
            throw new Exception($e);
        }
    }

}