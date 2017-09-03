<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Log;

/**
 * 全局log输出中间件
 * @package App\Http\Middleware
 */
class LogRequest
{
    public function handle(Request $request, Closure $next)
    {
        $params = array(
            "u_id" => $request->input("u_id"),
            "api_path" => $request->url(),
            "client_id" => $request->getClientIp(),
            "request_params" => $request->input()
        );

        Log::info(json_encode($params, JSON_UNESCAPED_SLASHES));
        $response = $next($request);
        $res_array = [
            'statusCode' => $response->status(),
            'content' => json_decode($response->content(), true),
        ];
        Log::info(json_encode($res_array, JSON_UNESCAPED_UNICODE));
        return $response;
    }

}
