package com.taager.allocation.capacity.commands.domain.models.valueobjects
import com.taager.allocation.capacity.commands.domain.exceptions.InvalidIdException
import java.util.*
fun String.toUUIDOrThrow(): UUID = try {
    UUID.fromString(this)
} catch (e: Exception) {
    throw InvalidIdException(this)
}