package com.taager.wallet.commands.domain.exceptions
import com.taager.wallet.sharedkernel.domain.exceptions.WalletException
class InvalidFormat: WalletException {
    constructor(message: String): super(message)
    constructor(): super()
}
