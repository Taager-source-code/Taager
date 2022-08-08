package com.taager.travolta.auth.domain
data class User(val id: String, val roles: List<UserRole>, val privileges: Set<String>, val groups: Set<String>) {
    constructor(id: String, roles: List<UserRole>) :
            this(
                id = id,
                roles = roles,
                privileges = roles.flatMap { it.privileges }.map { it.name }.toHashSet(),
                groups = roles.flatMap { it.privileges }.map { it.group }.toHashSet()
            )
    fun hasAnyPrivilege(privileges: List<WarehousePrivileges>): Boolean {
        return privileges.any { this.privileges.contains(it.value) }
    }
    fun hasAllPrivileges(): Boolean {
        return this.privileges.contains(WarehousePrivileges.WAREHOUSE_ALL.value)
    }
    fun hasWarehouseGroup(): Boolean {
        return groups.contains("warehouse")
    }
}
data class UserPrivilege(val name: String, val group: String)
data class UserRole(val name: String, val privileges: List<UserPrivilege>)
