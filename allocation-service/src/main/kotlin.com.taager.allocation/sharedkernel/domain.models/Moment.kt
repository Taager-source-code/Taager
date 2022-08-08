package com.taager.allocation.sharedkernel.domain.models
import com.taager.allocation.sharedkernel.domain.models.base.ValueObject
import java.time.Instant
data class Moment(val value: Long) : ValueObject, Comparable<Moment> {
    constructor(dateAsString: String) : this(Instant.parse(dateAsString).toEpochMilli())
    operator fun minus(theOtherMoment: Moment): Long = this.value - theOtherMoment.value
    operator fun plus(intervalMillis: Long): Moment = Moment(this.value + intervalMillis)
    companion object {
        fun now() = Moment(Instant.now().toEpochMilli())
        fun fromTimeStamp(epochTime: Long) = Moment(epochTime)
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
