package com.taager.allocation.allocator.commands.application.models
import com.taager.allocation.allocator.commands.domain.models.*
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ProvinceName
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneName
data class OrderConfirmedEvent (
    val orderId: OrderId,
    val zoneName: ZoneName,
    val provinceName: ProvinceName,
    val taagerId: TagerId,
    val countryIso: CountryIso,
    val cashOnDelivery: CashOnDelivery,
    val placedAt: PlacedAt,
    val confirmedAt: ConfirmedAt,
    val orderLines: List<OrderLine>,
    )
