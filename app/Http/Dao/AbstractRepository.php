<?php
/**
 * Created by PhpStorm.
 * User: warth
 * Date: 2017/9/3
 * Time: 21:59
 */

namespace App\Http\Dao;


use Exception;
use Illuminate\Support\Facades\DB;

abstract class AbstractRepository
{
    protected $table;
    protected $db = null;

    protected function db($db=null)
    {
        return DB::connection($db ?? $this->db)->table($this->table);
    }

    protected function table($table=null) {
        return DB::connection($db ?? $this->db)->table($table);
    }

    /**
     * @param null $where
     * @param array $fields
     * @param array $order
     * @return \Illuminate\Support\Collection
     * @throws Exception
     */
    public function findAll($where = null, $fields=['*'], $order=[])
    {
        try {

            $query = $this->db()->where(function ($query) use ($where) {
                foreach ($where as $key => $value)
                {
                    if (is_array($value)) {
                        list($key, $formula, $val) = $value;
                        $query->where($key, $formula, $val);
                    } else {
                        $query->where($key, '=', $value);
                    }
                }
            });
            if ($order) {
                $query = $query->orderBy($order[0], $order[1]);
            }

            return $query->get($fields);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function findCount($where = null, $column = '*')
    {
        try {
            return $this->db()->where($where)->count($column);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function findOne($where = null, $column, $join=null)
    {
        try {
            $query = $this->db()->where(function ($query) use ($where) {
                foreach ($where as $key => $value)
                {
                    if (is_array($value)) {
                        list($key, $formula, $val) = $value;
                        $query->where($key, $formula, $val);
                    } else {
                        $query->where($key, '=', $value);
                    }
                }
            });
            if ($join)

            return $query->pluck($column);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function find($where = null, $field = ['*'])
    {
        try {
            return $this->db()->where($where)->first($field);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function delete($where = null)
    {
        try {
            return $this->db()->where($where)->delete();
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function update(array $data = [], $where = null)
    {
        try {
            return $this->db()->where($where)->update($data);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }
}