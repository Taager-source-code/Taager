package com.taager.travolta.common.usermanagement
import com.taager.travolta.auth.domain.WarehousePrivileges
@Target(AnnotationTarget.FUNCTION)
@MustBeDocumented
annotation class RequiredPrivilege(val oneOf: Array<WarehousePrivileges>)
