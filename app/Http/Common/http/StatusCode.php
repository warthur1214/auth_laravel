<?php
/**
 * Created by PhpStorm.
 * User: warthur
 * Date: 17/9/9
 * Time: 下午12:09
 */

namespace App\Http\Common\http;


use MyCLabs\Enum\Enum;

class StatusCode extends Enum
{
    const SUCESS = 0;
    const ERROR = -1;
}