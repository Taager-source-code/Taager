package com.taager.allocation.allocator.commands.domain.models.valueobjects
import com.taager.allocation.sharedkernel.domain.models.Moment
import com.taager.allocation.sharedkernel.domain.models.base.ValueObject
data class TrackingId(val value: String): ValueObject
data class UpdateTime(val value: Moment) : ValueObject
data class ShippingCompany(val value: String) : ValueObject