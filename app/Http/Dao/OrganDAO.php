<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/10
 * Time: 下午9:38
 */

namespace App\Http\Dao;

use App\Http\Dao\inter\AbstractRepository;
use App\Http\Dao\inter\BaseDAO;
use Mockery\Exception;

class OrganDAO extends AbstractRepository implements BaseDAO
{
    protected $table = "t_organ as o";
    protected $db = 'auth';

    public function selectOrganList($where, $fields)
    {
        try {
            return $this->doWhere($where)
                ->join('t_organ_type as ot', 'o.organ_type_id', 'ot.organ_type_id')
                ->join('t_coop_type as ct', 'o.coop_type_id', 'ct.coop_type_id')
                ->get($fields);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function findOrganInfoById($where, $fields)
    {
        try {
            return $this->doWhere($where)
                ->join('t_organ_type as ot', 'o.organ_type_id', 'ot.organ_type_id')
                ->join('t_organ_level as ol', 'o.organ_level_id', 'ol.organ_level_id')
                ->join('t_province as pro', 'o.prov_code', 'pro.prov_code')
                ->join('t_city as city', 'o.city_code', 'city.city_code')
                ->leftJoin('t_organ as op', 'op.organ_id', 'o.parent_organ_id')
                ->first($fields);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }
}