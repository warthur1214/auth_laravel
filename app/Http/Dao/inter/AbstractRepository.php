<?php
/**
 * Created by PhpStorm.
 * User: warth
 * Date: 2017/9/3
 * Time: 21:59
 */

namespace App\Http\Dao\inter;


use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

abstract class AbstractRepository extends Model
{
    const CREATED_AT = 'create_time';
    const UPDATED_AT = 'update_time';

    protected $table;
    protected $db = null;

    protected function db($connection = null)
    {
        return DB::connection($connection ?? $this->connection)->table($this->table);
    }

    protected function table($table = null)
    {
        return DB::connection()->table($table);
    }

    protected function doWhere($where)
    {
        return $this->db()->when($where, function ($query) use ($where) {
            $query->where(function ($query) use ($where) {
                foreach ($where as $key => $value) {
                    if (is_array($value)) {
                        list($key, $formula, $val) = $value;
                        $query->where($key, $formula, $val, $value[4] ?? 'and');
                    } else {
                        $query->where($key, '=', $value);
                    }
                }
            });
        });
    }

    /**
     * @param null $where
     * @param array $fields
     * @param array $order
     * @return \Illuminate\Support\Collection
     * @throws Exception
     */
    public function findAll($fields = ['*'], $where = null, $group = [], $order = [])
    {
        try {

            $query = $this->doWhere($where)->when($group, function ($query) use ($group) {
                return $query->groupBy($group);
            })->when($order, function ($query) use ($order) {
                return $query->orderBy($order[0], $order[1]);
            });

            return $query->get($fields);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function findCount($column = '*', $where = null)
    {
        try {
            return $this->db()->where($where)->count($column);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function findOne($column, $where = null, $join = null)
    {
        try {
            $query = $this->doWhere($where)->when($join, function ($query) use ($join) {
                if (is_array($join[0])) {
                    return $query->join($join[0], $join[1], $join[2], $join[3], $join[4] ?? 'inner');
                }

                foreach ($join as $item) {
                    if (is_array($item)) {
                        $query->join($item[0], $item[1], $item[2], $item[3], $item[4] ?? 'inner');
                    }
                }
                return $query;
            });

            return $query->pluck($column);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public function find($fields, $where = null, $join = null)
    {
        try {
            if (is_string($fields)) {
                $fields = explode(",", $fields);
            }

            if (is_object($fields)) {
                $fields = get_class_vars(get_class($fields));
            }

            return $this->doWhere($where)->when($join, function ($query) use ($join) {
                if (is_array($join[0])) {
                    return $query->join($join[0], $join[1], $join[2], $join[3], $join[4] ?? 'inner');
                }

                foreach ($join as $item) {
                    if (is_array($item)) {
                        $query->join($item[0], $item[1], $item[2], $item[3], $item[4] ?? 'inner');
                    }
                }
                return $query;
            })->first($fields);
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

    public function update(array $data = [], array $where = [])
    {
        try {
            return $this->db()->where($where)->update($data);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }
}