package com.taager.wallet.sharedkernel.domain.exceptions
open class WalletException: RuntimeException {
    constructor(message: String): super(message)
    constructor(): super()
}
