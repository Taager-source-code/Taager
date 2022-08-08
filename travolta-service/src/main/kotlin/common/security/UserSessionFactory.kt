package com.taager.travolta.common.security
import com.taager.travolta.auth.domain.ExternaUserToken
import com.taager.travolta.auth.domain.UserSession
import com.taager.travolta.common.security.jwt.JwtTokenService
import org.springframework.stereotype.Component
@Component
class UserSessionFactory(private val jwtTokenService: JwtTokenService) {
    fun buildFrom(externalUserSession: ExternaUserToken, warehouseCode: String?): UserSession {
        val accessToken = externalUserSession.accessToken
        val appendedToken = jwtTokenService.appendWarehouseCode(token = accessToken, warehouseCode = warehouseCode)
        val user = jwtTokenService.getUser(accessToken)
        return UserSession(accessToken = appendedToken, user = user, warehouseCode = warehouseCode)
    }
    fun buildFrom(jwtToken : String): UserSession {
        return UserSession(
            accessToken = jwtToken,
            user = jwtTokenService.getUser(jwtToken),
            warehouseCode = jwtTokenService.getWarehouseCode(jwtToken)
        )
    }
}
