<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testBasicTest()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }


    public function testRequest()
    {
        $result = $this->get("http://localhost:8080/analysis/getorderanalysis.do?". http_build_query([
                'appId' => 'wx85fdc482d69a65dd',
                'beginDate' => '2017-09-01',
                'endDate' => '2017-10-17',
                'analysisType' => 'appointment'
            ]));

        dump($result);
    }
}
