package com.taager.allocation.allocator.commands.domain.exceptions
sealed class InvalidInputException(message: String) : RuntimeException(message)
data class InvalidAllocationStatusException(val invalidAllocationStatus: String) :
    InvalidInputException("[$invalidAllocationStatus] is invalid allocation config status")