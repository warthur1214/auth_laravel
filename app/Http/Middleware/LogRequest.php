<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            "clientIP" => $request->getClientIp(),
            "requestUrl" => $request->url(),
            "requestBody" => $request->input()
        );

        Log::info(json_encode($params, JSON_UNESCAPED_SLASHES));

        $response = $next($request);

        $res_array = [
            'statusCode' => $response->status(),
            'responseBody' => json_decode($response->content(), true),
        ];
        Log::info(json_encode($res_array, JSON_UNESCAPED_UNICODE));
        return $response;
    }

}
