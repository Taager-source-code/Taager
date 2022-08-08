package com.taager.travolta.auth.controller.converter
import com.taager.travolta.auth.domain.*
import com.taager.travolta.openapi.model.*
import org.springframework.stereotype.Component
@Component
class AuthControllerDtoConverter {
    fun convert(userCredentialsDto: UserCredentialsDto): UserCredentials {
        return UserCredentials(
            username = userCredentialsDto.username,
            password = userCredentialsDto.password,
            warehouseCode = userCredentialsDto.warehouseCode
        )
    }
    fun convert(userSession: UserSession): UserSessionDto {
        return UserSessionDto(
            accessToken = userSession.accessToken,
            user = convert(userSession.user)
        )
    }
    private fun convert(user: User): UserDto {
        return UserDto(
            id = user.id,
            roles = user.roles.map { convert(it) }
        )
    }
    private fun convert(userRole: UserRole): UserRoleDto {
        return UserRoleDto(
            name = userRole.name,
            privileges = userRole.privileges.map { convert(it) }
        )
    }
    private fun convert(userPrivilege: UserPrivilege): UserPrivilegeDto {
        return UserPrivilegeDto(
            name = userPrivilege.name,
            group = userPrivilege.group
        )
    }
}
