<?php

namespace Tests\Feature;

use GuzzleHttp\Client;
use Tests\TestCase;

class ExampleTest extends TestCase
{

    private $httpClient;

    public function __construct($name = null, array $data = [], $dataName = '')
    {
        parent::__construct($name, $data, $dataName);
        $this->httpClient = new Client(['base_uri' => "http://localhost:8080"]);
    }

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

        $result = $this->httpClient->get("/analysis/getorderanalysis.do", [
            'query'=> [
                'appId' => 'wx85fdc482d69a65dd',
                'beginDate' => '2017-09-01',
                'endDate' => '2017-10-17',
                'analysisType' => 'appointment'
            ]
        ]);

        $this->assertEquals(200, $result->getStatusCode());
        $this->assertNotEmpty($result->getBody()->getContents());
    }
}
