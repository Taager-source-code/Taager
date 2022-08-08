package com.taager.travolta.auth.service
import com.taager.travolta.auth.domain.WarehousePrivileges
class LoginForbiddenException(message: String, val userName: String) : RuntimeException(message)
class LoginErrorException(message: String, throwable: Throwable? = null) : RuntimeException(message, throwable)
class UserMissingRequiredPrivilegeException(requiredPrivileges: List<WarehousePrivileges>, foundPrivilege: List<String>) :
    RuntimeException("Required privileges $requiredPrivileges, found privileges $foundPrivilege")
class UserMissingWarehouseGroupException : RuntimeException()
