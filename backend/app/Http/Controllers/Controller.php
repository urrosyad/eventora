<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: "Eventora API Documentation",
    version: "1.0.0",
    description: "RESTful API untuk Platform Digital Sponsorship Management System Eventora"
)]
#[OA\Server(
    url: "/api",
    description: "API V1 Base URL"
)]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Masukkan token Bearer JWT Anda untuk mengakses endpoint yang aman"
)]
abstract class Controller
{
    //
}
