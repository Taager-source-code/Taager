package com.taager.travolta.sharedkernel.domain.models
import com.taager.ddd.models.base.ValueObject
import java.time.Instant
data class Moment(val value: Long) : ValueObject, Comparable<Moment> {
    constructor(dateAsString: String) : this(Instant.parse(dateAsString).toEpochMilli())
    operator fun minus(theOtherMoment: Moment): Long = this.value - theOtherMoment.value
    operator fun plus(intervalMillis: Long): Moment = Moment(this.value + intervalMillis)
    companion object {
        fun now() = Moment(Instant.now().toEpochMilli())
    }
    override operator fun compareTo(other: Moment): Int {
        val myValue = value
        val otherValue = other.value
        return when {
            myValue > otherValue -> 1
            myValue < otherValue -> -1
            else -> 0
        }
    }
}
data class UserId(val value: String) : ValueObject {
    override fun toString(): String = value
}
data class WarehouseCode(val value: String) : ValueObject {
    override fun toString(): String = value
}
data class LocationBarCode(val value: String) : ValueObject {
    override fun toString(): String = value
}
