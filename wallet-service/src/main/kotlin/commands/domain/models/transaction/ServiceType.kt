package com.taager.wallet.commands.domain.models.transaction
import com.taager.wallet.commands.domain.exceptions.InvalidFormat
import com.taager.wallet.commands.domain.models.base.ValueObject
import java.util.*
enum class ServiceType : ValueObject
{
    Orders, WithdrawalRequest, Compensation;
    companion object
    {
        fun fromString(serviceType: String): ServiceType = when (serviceType.lowercase(Locale.getDefault()))
        {
            "orders" -> Orders
            "withdrawalrequest" -> WithdrawalRequest
            "compensation" -> Compensation
            else -> throw InvalidFormat("$serviceType Not a valid service type. Should be one of these [Order, Withdrawal, or Compensation]")
        }
    }
}