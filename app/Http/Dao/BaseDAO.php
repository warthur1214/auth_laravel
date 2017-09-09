<?php
/**
 * Created by PhpStorm.
 * User: warth
 * Date: 2017/9/3
 * Time: 21:59
 */

namespace App\Http\Dao;


use Illuminate\Support\Facades\DB;
use Mockery\Exception;

class BaseDAO
{
    protected $table;
    protected $db = null;

    protected function db()
    {
        return DB::connection($db ?? null)->table($this->table);
    }

    public function selectDataList($where = null)
    {
        try {
            return $this->db()->where($where)->select();
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function findDataCount($where = null, $column = '*')
    {
        try {
            return $this->db()->where($where)->count($column);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function findDataInfo($where = null, $field = ['*'])
    {
        try {
            return $this->db()->where($where)->first($field);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function deleteDataInfo($where = null)
    {
        try {
            return $this->db()->where($where)->delete();
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function updateDataInfo(array $data = [], $where = null)
    {
        try {
            return $this->db()->where($where)->update($data);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }
}