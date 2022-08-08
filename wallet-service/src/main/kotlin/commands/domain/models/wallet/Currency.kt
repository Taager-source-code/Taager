package com.taager.wallet.commands.domain.models.wallet
import com.taager.wallet.commands.domain.exceptions.InvalidFormat
import com.taager.wallet.commands.domain.models.base.ValueObject
data class Currency(val isoCode: String) : ValueObject {
    init {
        if (isoCode.isBlank()) throw InvalidFormat("Currency can not be empty")
        if (isoCode.length != 3) throw InvalidFormat("Currency iso must be 3 character")
    }
}