<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/17
 * Time: 下午4:38
 */

namespace App\Http\Service\Impl;


use App\Http\Common\Util\ResponseUtil;
use App\Http\Dao\CooperateDAO;
use App\Http\Dao\DeviceTypeDAO;
use App\Http\Dao\OrganDAO;
use App\Http\Dao\OrganTypeDAO;
use App\Http\Service\OrganService;
use Illuminate\Http\Request;
use Mockery\Exception;

class OrganServiceImpl implements OrganService
{
    private $organDAO;
    private $organTypeDAO;
    private $cooperateDAO;
    private $deviceTypeDAO;

    public function __construct(OrganDAO $organDAO, OrganTypeDAO $organTypeDAO, CooperateDAO $cooperateDAO,
                                DeviceTypeDAO $deviceTypeDAO)
    {
        $this->organDAO = $organDAO;
        $this->organTypeDAO = $organTypeDAO;
        $this->cooperateDAO = $cooperateDAO;
        $this->deviceTypeDAO = $deviceTypeDAO;
    }

    public function getOrganTypeList()
    {
        try {
            $response = $this->organTypeDAO->get(['organ_type_id', 'organ_type_name']);
        } catch (\Exception $e) {
            throw new Exception($e);
        }
        return ResponseUtil::successData($response);
    }

    public function getCooperateList()
    {
        try {
            $response = $this->cooperateDAO->get(['coop_type_id', 'coop_type']);
        } catch (\Exception $e) {
            throw new Exception($e);
        }
        return ResponseUtil::successData($response);
    }

    public function getOrganListData(Request $request)
    {

        $where['o.parent_organ_id'] = 0;

        if ($request->has('organ_name') && $request->get('organ_name', null) != null) {
            $where[] = ['o.organ_name', 'like', "%{$request->get('organ_name')}%"];
        }
        if ($request->has("organ_type_id") && $request->get('organ_type_id', null) != null) {
            $where['ot.organ_type_id'] = $request->get('organ_type_id');
        }
        if ($request->has('coop_type_id') && $request->get('coop_type_id', null) != null) {
            $where['ct.coop_type_id'] = $request->get('coop_type_id');
        }

        $fileds = ['o.organ_id', 'o.organ_name', 'o.organ_short_name', 'ot.organ_type_name', 'ct.coop_type as coop_type_id',
            'o.parent_organ_id','o.is_available'];

        try {
            $response = $this->organDAO->selectOrganList($where, $fileds);
        } catch (\Exception $e) {
            throw new Exception($e);
        }
        return ResponseUtil::successData($response);
    }

    public function getOrganInfoById($organId)
    {
        $where['o.organ_id'] = $organId;
        $fileds = ['o.*', 'pro.prov_name', 'city.city_name', 'ol.organ_level_name',
            'ot.organ_type_name', 'op.organ_name as organ_parent'];

        try {
            $response = $this->organDAO->findOrganInfoById($where, $fileds);
        } catch (\Exception $e) {
            throw new Exception($e);
        }
        return ResponseUtil::successData($response);
    }

    public function removeOrganInfo($organId)
    {
        $where['o.parent_organ_id'] = $organId;

        try {
            // 企业下有无子机构
            $count = $this->organDAO->findCount($where, 'organ_id');
            if ($count > 0) {
                return ResponseUtil::errorMsg("该企业存在所属信息，请检查！");
            }

            $organInfo = $this->organDAO->find(['organ_id'=>$organId],
                ['o.organ_id', 'o.organ_name', 'o.organ_type_id']);
            if ($organInfo->organ_type_id == 4) {
                $count = $this->deviceTypeDAO->where(['supplied_organ_id'=>$organId])->findCount('device_type_id');
                if ($count > 0) {
                    return ResponseUtil::errorMsg("该硬件厂商存在关联硬件类型，请检查！");
                }
            }

            $this->organDAO->delete(['organ_id'=>$organId]);
        } catch (\Exception $e) {
            throw new Exception($e);
        }
        return ResponseUtil::success();
    }

    public function updateOrganAvailable(Request $request)
    {
        $where['o.organ_id'] = $request->input("organ_id");

        try {
            $this->organDAO->where($where)->update(['is_available'=>$request->input('is_available')]);
        } catch (\Exception $e) {
            throw new Exception($e);
        }
        return ResponseUtil::success();
    }
}