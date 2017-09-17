<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/17
 * Time: 下午5:23
 */

namespace App\Http\Dao;


use App\Http\Dao\inter\AbstractRepository;
use App\Http\Dao\inter\BaseDAO;

class CooperateDAO extends AbstractRepository implements BaseDAO
{
    protected $table = 't_coop_type as ct';
    protected $db = 'auth';
}