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
    protected static $table;

    protected static function db()
    {
        return DB::table(self::$table);
    }

    public static function selectDataList($where = null)
    {
        try {
            return self::db()->where($where)->select();
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public static function findDataInfoById($where = null, $field=['*'])
    {
        try {
            return self::db()->where($where)->get($field);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public static function deleteDataInfoById($where = null)
    {
        try {
            return self::db()->where($where)->delete();
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }

    public static function updateDataInfo(array $data = [], $where = null)
    {
        try {
            return self::db()->where($where)->update($data);
        } catch (Exception $e) {
            throw new Exception($e);
        }
    }
}