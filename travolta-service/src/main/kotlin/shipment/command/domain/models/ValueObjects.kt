package com.taager.travolta.shipment.command.domain.models.shipment
import com.taager.ddd.models.base.ValueObject
data class OrderId(val value: String) : ValueObject {
    override fun toString(): String = value
}
data class TrackingId(private val trackingId: String) : ValueObject {
    var value: String = trackingId
        get() { return field.uppercase() }
    override fun toString(): String = value
    override fun equals(other: Any?): Boolean {
        if (other == null) return false
        if (other.javaClass != javaClass) return false
        other as TrackingId
        return value == other.value
    }
    override fun hashCode(): Int {
        return value.hashCode()
    }
}
data class ShippingCompany(val value: String) : ValueObject {
    override fun toString(): String = value
}
data class Quantity(val value: Int) : ValueObject {
    companion object {
        fun of(value: Int) = Quantity(value)
        fun empty() = Quantity(0)
    }
    override fun toString(): String = value.toString()
    operator fun plus(otherQuantity: Quantity): Quantity = Quantity(this.value + otherQuantity.value)
}
data class OrderLine(val variantId: VariantId,
                     val variantName: VariantName,
                     var variantPicture: VariantPicture? = null,
                     val quantity: Quantity,
                     val attributes: List<OrderLineAttribute>) {
}
data class OrderLineAttribute(val type: String, val value: String)
data class VariantId(val value: String) : ValueObject {
    override fun toString(): String = value
    override fun equals(other: Any?): Boolean {
        if (other == null) return false
        if (other.javaClass != javaClass) return false
        other as VariantId
        return value == other.value
    }
}
data class VariantName(val value: String) : ValueObject {
    override fun toString(): String = value
}
data class VariantPicture(val value: String) : ValueObject {
    override fun toString(): String = value
}
data class PackageSealed(val value: Boolean) : ValueObject
data class Duration(val millisValue: Long) : ValueObject, Comparable<Duration> {
    operator fun minus(theOtherDuration: Duration): Duration = Duration(this.millisValue - theOtherDuration.millisValue)
    operator fun plus(theOtherDuration: Duration): Duration = Duration(this.millisValue + theOtherDuration.millisValue)
    operator fun plus(intervalMillis: Long): Duration = Duration(this.millisValue + intervalMillis)
    override operator fun compareTo(other: Duration): Int {
        val myValue = millisValue
        val otherValue = other.millisValue
        return when {
            myValue > otherValue -> 1
            myValue < otherValue -> -1
            else -> 0
        }
    }
}