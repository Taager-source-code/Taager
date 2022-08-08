package com.taager.travolta.picklist.command.domain.models.picklist
import com.taager.ddd.models.base.ValueObject
import com.taager.travolta.picklist.command.domain.exceptions.InvalidQuantityException
import com.taager.travolta.picklist.command.domain.exceptions.MissingPicklistNameException
import com.taager.travolta.sharedkernel.domain.models.Moment
import com.taager.travolta.sharedkernel.domain.models.toUUIDOrThrow
import java.util.*
data class PicklistId(val value: UUID) : ValueObject {
    companion object {
        fun newId(): PicklistId = PicklistId(UUID.randomUUID())
        fun of(value: String) = PicklistId(value.toUUIDOrThrow())
    }
    override fun toString(): String = value.toString()
}
data class PicklistAssignment(val assignedTo: PickerId, val assignedAt: AssignedAt) : ValueObject {
    companion object {
        fun new(assignedTo: PickerId): PicklistAssignment {
            return PicklistAssignment(
                assignedTo = assignedTo,
                assignedAt = AssignedAt.now()
            )
        }
    }
}
data class AssignedAt(val value: Moment) : ValueObject, Comparable<AssignedAt> {
    constructor(longValue: Long) : this(Moment(longValue))
    companion object {
        fun now() = AssignedAt(Moment.now())
    }
    override operator fun compareTo(other: AssignedAt): Int {
        val myValue = value
        val otherValue = other.value
        return when {
            myValue > otherValue -> 1
            myValue < otherValue -> -1
            else -> 0
        }
    }
    override fun toString(): String = value.toString()
    fun primitiveForm() = value.value
}
data class PickedAt(val value: Moment) : ValueObject, Comparable<PickedAt> {
    constructor(longValue: Long) : this(Moment(longValue))
    companion object {
        fun now() = PickedAt(Moment.now())
    }
    override operator fun compareTo(other: PickedAt): Int {
        val myValue = value
        val otherValue = other.value
        return when {
            myValue > otherValue -> 1
            myValue < otherValue -> -1
            else -> 0
        }
    }
    override fun toString(): String = value.toString()
    fun primitiveForm() = value.value
}
data class PickerId(val value: String) : ValueObject {
    override fun toString(): String = value
}
data class PicklistName(val value: String) : ValueObject {
    init {
        if (value.isBlank())
            throw MissingPicklistNameException()
    }
    override fun toString(): String = value
}
data class Quantity(val value: Int) : ValueObject, Comparable<Quantity> {
    init {
        if (value < 0)
            throw InvalidQuantityException(this)
    }
    companion object {
        fun of(value: Int) = Quantity(value)
        fun empty() = Quantity(0)
    }
    operator fun minus(theOtherQuantity: Quantity): Quantity = Quantity(this.value - theOtherQuantity.value)
    override operator fun compareTo(other: Quantity): Int {
        val myValue = value
        val otherValue = other.value
        return when {
            myValue > otherValue -> 1
            myValue < otherValue -> -1
            else -> 0
        }
    }
    override fun toString(): String = value.toString()
}
data class VariantId(val value: String) : ValueObject {
    override fun toString(): String = value
}
data class ItemId(val value: UUID) : ValueObject {
    companion object {
        fun newId(): ItemId = ItemId(UUID.randomUUID())
        fun of(value: String) = ItemId(value.toUUIDOrThrow())
    }
    override fun toString(): String = value.toString()
}
