package com.taager.travolta.sharedkernel.domain.contracts
import com.taager.travolta.auth.domain.UserSession
import com.taager.travolta.variant.domain.Variant
interface VariantGateway {
    fun fetchVariantDetails(variantIds: List<String>, userSession: UserSession): List<Variant>
}
