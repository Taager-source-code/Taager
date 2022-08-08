package com.taager.travolta.common.security.jwt.converter
import com.taager.travolta.auth.domain.User
import com.taager.travolta.auth.domain.UserPrivilege
import com.taager.travolta.auth.domain.UserRole
import com.taager.travolta.common.security.jwt.dto.JwtUser
import com.taager.travolta.common.security.jwt.dto.JwtUserPrivilege
import com.taager.travolta.common.security.jwt.dto.JwtUserRole
import org.springframework.stereotype.Component
@Component
class JwtUserConverter {
    fun convert(user: JwtUser) : User {
        val userRoles = user.userRoles?.map { convert(it) } ?: emptyList()
        return User(id = user.id, roles = userRoles)
    }
    private fun convert(userRole: JwtUserRole) : UserRole {
        val privileges = userRole.privileges?.map { convert(it) } ?: emptyList()
        return UserRole(name = userRole.name, privileges = privileges)
    }
    private fun convert(userPrivilege: JwtUserPrivilege) : UserPrivilege {
        return UserPrivilege(name = userPrivilege.name, group = userPrivilege.group)
    }
}
