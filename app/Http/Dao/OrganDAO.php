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

class OrganDAO extends AbstractRepository implements BaseDAO
{
    protected $table = "t_organ";


}