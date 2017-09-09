<?php

namespace App\Http\Controllers;

use App\Http\Common\Util\ResponseUtil;
use App\Http\Service\LoginService;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;
use Log;
use Mockery\Exception;

class LoginController extends Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    private $loginService;

    public function __construct(LoginService $loginService)
    {
        $this->loginService = $loginService;
    }

    public function login()
    {
        return response()->view("index.login");
    }

    public function loginAjax(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'account_name' => 'required|max:20',
            'password' => 'required|max:32'
        ]);

        try {
            if ($validator->fails()) {
                return ResponseUtil::errorMsg("登录失败！", $validator->errors()->all());
            }

            $result = $this->loginService->checkLogin($request->all());

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return ResponseUtil::errorMsg($e->getMessage());
        }

        return $result;
    }
}
