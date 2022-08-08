package com.taager.wallet.commands.domain.models.wallet
import com.taager.wallet.commands.domain.exceptions.InvalidAmountException
import java.math.BigDecimal
sealed class Amount(open val value: BigDecimal) {
    protected fun assertAmountNotNegative(amount: Amount) {
        if (amount.value < BigDecimal.ZERO)
            throw InvalidAmountException("${amount.value} is invalid, should be positive number")
    }
}
data class EligibleAmount(override val value: BigDecimal) : Amount(value) {
    companion object {
        val ZERO = EligibleAmount(BigDecimal.ZERO)
    }
    operator fun plus(increment: EligibleAmount): EligibleAmount {
        assertAmountNotNegative(increment)
        return EligibleAmount(value + increment.value)
    }
    operator fun minus(decrement: EligibleAmount): EligibleAmount {
        assertAmountNotNegative(decrement)
        return EligibleAmount(value - decrement.value)
    }
}
data class ExpectedAmount(override val value: BigDecimal) : Amount(value) {
    companion object {
        val ZERO = ExpectedAmount(BigDecimal.ZERO)
      
    }
    operator fun plus(increment: ExpectedAmount): ExpectedAmount {
        assertAmountNotNegative(increment)
        return ExpectedAmount(value + increment.value)
    }
    operator fun minus(decrement: ExpectedAmount): ExpectedAmount {
        assertAmountNotNegative(decrement)
        return ExpectedAmount(value - decrement.value)
    }
}