package com.taager.wallet.commands.domain.models.transaction
import com.taager.wallet.commands.domain.models.base.ValueObject
data class Service(
    val type: ServiceType,
    val transactionId: String,
    val subType: String?
) : ValueObject
