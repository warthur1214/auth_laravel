<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/17
 * Time: 下午8:41
 */

namespace App\Http\Dao;


use App\Http\Dao\inter\AbstractRepository;
use App\Http\Dao\inter\BaseDAO;

class DeviceTypeDAO extends AbstractRepository implements BaseDAO
{
    protected $table = 't_device_type as dt';
    protected $db = 'biz';
}