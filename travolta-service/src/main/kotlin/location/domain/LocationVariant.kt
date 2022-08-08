package com.taager.travolta.location.domain
data class LocationVariant(
    val variantId: String,
    private var quantity : Int
) {
    fun addQuantity(quantity: Int) {
        this.quantity += quantity
    }
    fun removeQuantity(quantity: Int) {
        this.quantity -= quantity
    }
    fun getQuantity() = quantity
}