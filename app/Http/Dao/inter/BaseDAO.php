<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/10
 * Time: 上午9:06
 */

namespace App\Http\Dao\inter;


interface BaseDAO
{
    public function findAll($where, $fields);

    public function findCount($where, $column);

    public function findOne($where, $column);

    public function find($where, $field);

    public function delete($where);

    public function update(array $data, array $where);
}