package com.taager.wallet.commands.domain.models.transaction
import com.taager.wallet.commands.domain.models.base.ValueObject
import java.util.*
data class TransactionId(val value: UUID) : ValueObject