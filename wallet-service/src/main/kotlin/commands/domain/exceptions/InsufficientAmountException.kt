package com.taager.wallet.commands.domain.exceptions
import com.taager.wallet.sharedkernel.domain.exceptions.WalletException
class InsufficientAmountException: WalletException {
    constructor(message: String): super(message)
    constructor(): super()
}
class InvalidAmountException: WalletException {
    constructor(message: String): super(message)
    constructor(): super()
}
