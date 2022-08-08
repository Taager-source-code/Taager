package com.taager.allocation.allocator.commands.domain.exceptions
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ProvinceName
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneName
sealed class AllocatorNotFoundException(message: String) : RuntimeException(message)
data class OrderNotFoundException(val orderId: OrderId) :
    AllocatorNotFoundException("$orderId doesn't exist")
data class ZoneInProvinceNotFoundException( val provinceName: ProvinceName, val zoneName: ZoneName) :
    AllocatorNotFoundException(" $zoneName in $provinceName was not found")
data class AllocatorConfigNotFoundException(val allocatorConfigMessage: String) :
    AllocatorNotFoundException(allocatorConfigMessage)