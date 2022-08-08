package com.taager.allocation.capacity.commands.domain.exceptions
sealed class InvalidInputException(message: String) : RuntimeException(message)
data class CapacityCanNoBeNegativeException(val invalidValue: Int) :
    InvalidInputException("Invalid Capacity value [$invalidValue], Capacity can not be negative")
data class CapacityCanNotBeLowerThanExhaustedCapacityException(val capacityValue: Int, val exhaustedValue: Int) :
    InvalidInputException("Invalid Capacity value [$capacityValue], Capacity can not be lower than the number of already Allocated orders [$exhaustedValue]")
data class InvalidCapacityModeException(val invalidCapacity: String) :
    InvalidInputException("[$invalidCapacity] is invalid capacity mode")
data class InvalidIdException(val id: String) : InvalidInputException("[$id] is invalid id")
data class InvalidCutOffTimeFormatException(val invalidTime: String) :
    InvalidInputException("[$invalidTime] is invalid cut-off time format")