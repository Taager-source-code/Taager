package com.taager.wallet.commands.domain.events
import com.taager.wallet.commands.domain.models.base.DomainEvent
import com.taager.wallet.commands.domain.models.transaction.Transaction
data class TransactionCreated(val transaction: Transaction) : DomainEvent