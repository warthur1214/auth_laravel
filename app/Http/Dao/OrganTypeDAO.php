<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/17
 * Time: 下午5:21
 */

namespace App\Http\Dao;


use App\Http\Dao\inter\AbstractRepository;
use App\Http\Dao\inter\BaseDAO;

class OrganTypeDAO extends AbstractRepository implements BaseDAO
{
    protected $table = 't_organ_type as ot';
    protected $db = 'auth';
}