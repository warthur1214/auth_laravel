<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/17
 * Time: 下午4:31
 */

namespace App\Http\Controllers;


use App\Http\Common\Util\ResponseUtil;
use App\Http\Service\OrganService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;
use Log;

class OrganController extends Controller
{

    private $organService;

    public function __construct(OrganService $organService)
    {
        $this->organService = $organService;
    }

    public function organList()
    {
        return response()->view('organ.organ_list');
    }

    public function organListAjax(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'organ_name' => 'nullable|string|max:20',
            'organ_type_id' => 'nullable|numeric|min:1',
            'coop_type_id' => 'nullable|numeric|min:1',
        ]);

        try {

            if ($validator->fails()) {
                return ResponseUtil::errorMsg("查询企业列表失败！", $validator->errors()->all());
            }

            $result = $this->organService->getOrganListData($request);

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return ResponseUtil::errorMsg($e->getMessage());
        }

        return $result;
    }

    public function getOrganTypeList()
    {
        try {
            $result = $this->organService->getOrganTypeList();

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return ResponseUtil::errorMsg($e->getMessage());
        }

        return $result;
    }

    public function getCooperateList()
    {
        try {
            $result = $this->organService->getCooperateList();

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return ResponseUtil::errorMsg($e->getMessage());
        }

        return $result;
    }

    public function scanOrgan(int $organId)
    {
        return response()->view('organ.organ_check', [
            'organId' => $organId
        ]);
    }

    public function getOrganInfoById(int $organId)
    {
        try {
            $result = $this->organService->getOrganInfoById($organId);

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return ResponseUtil::errorMsg($e->getMessage());
        }

        return $result;
    }

    public function removeOrganInfo(int $organId)
    {
        try {
            $result = $this->organService->getOrganInfoById($organId);

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return ResponseUtil::errorMsg($e->getMessage());
        }

        return $result;
    }

    public function organAvailable(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'is_available' => 'required|numberic|min:0|max:1',
                'organ_id' => 'required|numberic|min:1'
            ]);

            if ($validator->fails()) {
                return ResponseUtil::errorMsg($validator->errors()->all());
            }

            $result = $this->organService->updateOrganAvailable($request);

        } catch (Exception $e) {
            Log::error($e->getMessage());
            return ResponseUtil::errorMsg($e->getMessage());
        }

        return $result;
    }

    public function addOrgan()
    {
        return response()->view('organ.organ_add');
    }
}