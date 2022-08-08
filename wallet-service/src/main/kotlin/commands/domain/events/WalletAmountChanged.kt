package com.taager.wallet.commands.domain.events
import com.taager.wallet.commands.domain.models.base.DomainEvent
import com.taager.wallet.commands.domain.models.wallet.Wallet
data class WalletAmountChanged(val wallet: Wallet) : DomainEvent