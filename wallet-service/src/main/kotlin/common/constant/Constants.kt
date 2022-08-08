package com.taager.wallet.common.infrastructure.db.constants
enum class TransactionTypeDbo(val id: String, val value: String) {
    CREDIT("CR", "CREDIT"),
    DEBIT("DR", "DEBIT");
}
enum class AmountTypeDbo(val id: String, val value: String) {
    ELIGIBLE("ELIGIBLE", "ELIGIBLE"),
    EXPECTED("EXPECTED", "EXPECTED");
}
