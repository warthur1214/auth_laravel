<?php
/**
 * Created by PhpStorm.
 * User: warth
 * Date: 2018/2/9
 * Time: 15:37
 */

namespace App\Http\Controllers;


use App\Http\Common\Util\Constants;
use GuzzleHttp\Client;
use GuzzleHttp\RequestOptions;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Redis;

class OAuthController extends Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    private $httpClient;

    public function __construct()
    {
        $this->httpClient = new Client(['base_uri' => "https://aip.baidubce.com"]);
    }

    public function getToken(Request $request) {

        $oauthToken = Redis::get(Constants::OAUTH_CACHE_TOKEN);

        if (!$oauthToken) {
            $oauthToken = $this->httpClient->get('/oauth/2.0/token', [
                'query'=> [
                    'grant_type'=>$request->input('grant_type'),
                    'client_id'=>$request->input('client_id'),
                    'client_secret'=>$request->input('client_secret')
                ]
            ])->getBody()->getContents();

            Redis::set(Constants::OAUTH_CACHE_TOKEN, $oauthToken, 'EX', json_decode($oauthToken)->expires_in);
        }
        return response($oauthToken)->header('content-type', 'application/json;charset=utf-8');
    }

    public function ImageUpload(Request $request) {

        $res = $this->httpClient->post('/rpc/2.0/ai_custom/v1/classification/model_293', [
            'query'=> [
                'access_token' => $request->access_token
            ],
            RequestOptions::JSON => [
                'image'=>$request->image,
                'top_num'=>$request->top_num ?? 6
            ]
        ]);

        return response($res->getBody()->getContents())->header('content-type', 'application/json;charset=utf-8');
    }
}