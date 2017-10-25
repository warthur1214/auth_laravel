<?php

namespace App\Http\Controllers;

use App\Http\Common\Util\ResponseUtil;
use App\Http\Service\LoginService;
use GuzzleHttp\Client;
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
    private $httpClient;

    public function __construct(LoginService $loginService)
    {
        $this->loginService = $loginService;
        $this->httpClient = new Client(['base_uri' => "http://localhost:8080"]);
    }

    public function login()
    {
//        $result = $this->httpClient->get("/analysis/getorderanalysis.do", [
//            'query'=> [
//                'appId' => 'wx85fdc482d69a65dd',
//                'beginDate' => '2017-09-01',
//                'endDate' => '2017-10-17',
//                'analysisType' => 'appointment'
//            ]
//        ]);
//        dump($result->getBody()->getContents());

        return response()->view("index.login");
    }

    public function index()
    {
        if (session("auth_account_cache")) {
            return response()->view('index.index');
        } else {
            return response()->view('index.login');
        }
    }

    public function main()
    {
        //获得当前时间
        $week = array("日", "一", "二", "三", "四", "五", "六");
        $date = date('Y年m月d日', time()) . ' 星期' . $week[date('w')] . ' 北京时间：' . date('H:i:s', time());

        //获取当前角色
        return view("index.main", [
            'date' => $date,
            'display_name' => session("auth_account_cache")->account_info->real_name
        ]);
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

    public function loginOut(Request $request)
    {

        $request->session()->flush();

        return response()->redirectTo('/');
    }

    public function menu()
    {
        $menuList = $this->loginService->getMenuList([
            'parent_module_id'=>0,
            'is_visible' => 1,
            'platform_id' =>env("APP_PLATFORM_ID")
        ]);
        return view("index.menu", [
            'menuList' => $menuList
        ]);
    }
}
