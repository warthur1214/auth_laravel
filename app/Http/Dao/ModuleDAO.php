<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/10
 * Time: 上午10:33
 */

namespace App\Http\Dao;

use App\Http\Dao\inter\AbstractRepository;
use App\Http\Dao\inter\BaseDAO;
use Mockery\Exception;

class ModuleDAO extends AbstractRepository implements BaseDAO
{
    protected $table = "t_module as m";

    public function getModuleListByRoleId($where=[], $fields=['*'], $in=[], $sort=[])
    {
        try {
            return $this->db()->when($in, function ($query) use ($in) {
                return $query->whereIn($in[0], $in[1]);
            })->where($where)->join('t_role_module_rel as rm', 'rm.module_id', '=', 'm.module_id')
                ->orderBy($sort[0], $sort[1])
                ->get($fields);
        } catch (\Exception $e) {
            throw new Exception($e);
        }
    }
}