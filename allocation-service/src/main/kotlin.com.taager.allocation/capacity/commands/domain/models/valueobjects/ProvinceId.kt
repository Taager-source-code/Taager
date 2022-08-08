package com.taager.allocation.capacity.commands.domain.models.valueobjects
import com.taager.allocation.sharedkernel.domain.models.base.ValueObject
import java.util.*
data class ProvinceId(val value: UUID) : ValueObject {
    companion object {
        fun of(value: String): ProvinceId = ProvinceId(value.toUUIDOrThrow())
    }
}