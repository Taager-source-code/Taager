package com.taager.allocation.capacity.commands.domain.exceptions
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
sealed class NotFoundException(message: String) : RuntimeException(message)
data class PriorityNotFoundException(val priorityId: PriorityId) :
    NotFoundException("$priorityId doesn't exist")
data class ProvinceNotFoundException(val provinceId: ProvinceId) :
    NotFoundException("$provinceId doesn't exist")
data class ZoneNotFoundException(val zoneId: ZoneId) : NotFoundException("$zoneId doesn't exist")