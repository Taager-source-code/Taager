package com.taager.travolta.sharedkernel.domain.exceptions
open class WmsException(message: String) : RuntimeException(message)
open class InvalidInputException(message: String) : WmsException(message)
class InvalidIdException(id: String) : InvalidInputException("[$id] is invalid id")
