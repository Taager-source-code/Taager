package com.taager.travolta.common.reporting.useractions.kinesis.model
sealed class UserActionKinesisModel(val type: ActionType) {
    abstract val userId: String
    abstract val timestamp: Long
}
data class UserLoginKinesisModel(override val userId: String, override val timestamp: Long) :
    UserActionKinesisModel(ActionType.USER_LOGIN)
data class UserLogoffKinesisModel(override val userId: String, override val timestamp: Long) :
    UserActionKinesisModel(ActionType.USER_LOGOFF)
data class VariantAddedKinesisModel(
    override val userId: String,
    val variantId: String,
    val locationId: String,
    val locationBarCode: String,
    val quantity: Int,
    override val timestamp: Long
) : UserActionKinesisModel(ActionType.VARIANT_ADDED)
data class VariantRemovedKinesisModel(
    override val userId: String,
    val variantId: String,
    val locationId: String,
    val locationBarCode: String,
    val quantity: Int,
    override val timestamp: Long
) : UserActionKinesisModel(ActionType.VARIANT_REMOVED)
data class ItemPickedKinesisModel(
        override val userId: String,
        val itemId: String,
        val variantId: String,
        val quantity: Int,
        val locationBarCode: String,
        override val timestamp: Long,
) : UserActionKinesisModel(ActionType.ITEM_PICKED)
enum class ActionType {
    USER_LOGIN,
    USER_LOGOFF,
    VARIANT_ADDED,
    VARIANT_REMOVED,
    ITEM_PICKED,
}
