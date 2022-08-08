package com.taager.allocation.allocator.commands.domain.exceptions
sealed class AllocationInvalidInputException(message: String) : RuntimeException(message)
data class InvalidDateFormatException(val invalidTime: String) :
    AllocationInvalidInputException("[$invalidTime] is invalid date format")