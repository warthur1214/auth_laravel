<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/9
 * Time: 下午12:03
 */

namespace App\Http\Common\Util;


use App\Http\Common\http\StatusCode;

class ResponseUtil
{
    private static function response(array $data)
    {
        return response()->json($data);
    }

    public static function success(int $code = null, string $msg = null, $data = null)
    {

        $array = [
            'status' => $code ?? StatusCode::SUCESS,
            'msg' => $msg ?? Constants::REQUEST_SUCCESS,
        ];
        if ($data != null) {
            $array['data'] = $data;
        }

        return self::response($array);
    }

    public static function successMsg(string $msg = null, $data = null)
    {
        $array = [
            'status' => StatusCode::SUCESS,
            'msg' => $msg ?? Constants::REQUEST_SUCCESS,
        ];
        if ($data != null) {
            $array['data'] = $data;
        }

        return self::response($array);
    }

    public static function error(int $code = null, string $msg = null, $data = null)
    {

        $array = [
            'status' => $code ?? StatusCode::ERROR,
            'msg' => $msg ?? Constants::REQUEST_ERROR,
        ];
        if ($data != null) {
            $array['data'] = $data;
        }

        return self::response($array);
    }

    public static function errorMsg(string $msg = null, $data = null)
    {
        $array = [
            'status' => StatusCode::ERROR,
            'msg' => $msg ?? Constants::REQUEST_ERROR,
        ];
        if ($data != null) {
            $array['data'] = $data;
        }

        return self::response($array);
    }

}
