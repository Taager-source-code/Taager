package com.taager.wallet.common.infrastructure.db.models
import org.springframework.data.relational.core.mapping.Column
import java.math.BigDecimal
class AmountsDbo(
    @Column("eligibleAmount")
    val eligibleAmount: BigDecimal,
    @Column("expectedAmount")
    val expectedAmount: BigDecimal
)
