<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/10
 * Time: 下午9:43
 */

namespace App\Http\Dao;

use App\Http\Dao\inter\AbstractRepository;
use App\Http\Dao\inter\BaseDAO;
use Exception;
use function foo\func;

class RoleDAO extends AbstractRepository implements BaseDAO
{
    protected $table = "t_role as r";
    protected $db = 'auth';

    public function findOrganIdByRole($column, $data)
    {
        try {
            return $this->db()->whereIn($column, $data)->leftJoin(
                't_role_organ_rel as ro',
                'r.role_id',
                '=',
                'ro.role_id'
            )->pluck('organ_id');
        } catch (\Exception $e) {
            throw new Exception($e);
        }
    }

    public function findModuleIdByRole($column, $data)
    {
        try {
            return $this->table("t_role_module_rel as rm")
                ->whereIn($column, $data)
                ->pluck('rm.module_id');
        } catch (\Exception $e) {
            throw new Exception($e);
        }
    }
}