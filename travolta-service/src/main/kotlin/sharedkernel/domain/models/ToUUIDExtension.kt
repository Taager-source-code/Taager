package com.taager.travolta.sharedkernel.domain.models
import com.taager.travolta.sharedkernel.domain.exceptions.InvalidIdException
import java.util.*
fun String.toUUIDOrThrow(): UUID = try {
    UUID.fromString(this)
} catch (e: Exception) {
    throw InvalidIdException(this)
}