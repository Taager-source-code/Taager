package com.taager.travolta.common.reporting.useractions.domain
sealed class UserAction {
    abstract val userId: String
}
data class UserLogin(override val userId: String) : UserAction()
data class UserLogoff(override val userId: String) : UserAction()
data class VariantAdded(
        override val userId: String,
        val variantId: String,
        val locationId: String,
        val locationBarCode: String,
        val quantity: Int
) :UserAction()
data class VariantRemoved(
        override val userId: String,
        val variantId: String,
        val locationId: String,
        val locationBarCode: String,
        val quantity: Int
) : UserAction()
data class ItemPicked(
        override val userId: String,
        val itemId: String,
        val variantId: String,
        val quantity: Int,
        val locationBarCode: String,
) : UserAction()
