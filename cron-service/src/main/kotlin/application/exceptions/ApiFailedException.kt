package com.taager.cronservice.infrastructure.application.exceptions
class ApiFailedException(private val code: Int, private val status: String) :
    Exception("Error occurred calling the api  $code $status")