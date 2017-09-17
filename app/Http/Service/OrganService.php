<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/17
 * Time: 下午4:37
 */

namespace App\Http\Service;


use Illuminate\Http\Request;

interface OrganService
{
    public function getOrganTypeList();

    public function getCooperateList();

    public function getOrganListData(Request $request);

    public function getOrganInfoById($organId);

    public function removeOrganInfo($organId);

    public function updateOrganAvailable(Request $reqParam);
}