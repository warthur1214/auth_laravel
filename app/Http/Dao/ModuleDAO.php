<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/10
 * Time: 上午10:33
 */

namespace App\Http\Dao;


class ModuleDAO extends AbstractRepository implements BaseDAO
{
    protected $table = "t_module as m";

}