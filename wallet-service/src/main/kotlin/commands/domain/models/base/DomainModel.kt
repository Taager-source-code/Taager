package com.taager.wallet.commands.domain.models.base
/**
 * This class should be used to describe any entity domain class (DDD)
 * Entities should have id that identify it, this id should be a value object
 * ### For Example
```
data class UserID(val id: UUID) : ValueObject
class User(id: UserID) : Entity<UserID>(id)
{
// some code
}
```
 *
 */
open class Entity<out T : ValueObject>(val id: T) : DomainModel
{
    fun isSame(other: Any?): Boolean
    {
        if (other == null) return false
        if (other.javaClass != javaClass) return false
        other as Entity<*>
        return id == other.id
    }
}