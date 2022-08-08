package com.taager.travolta.common.security
import com.taager.travolta.auth.domain.UserSession
import com.taager.travolta.common.security.jwt.JwtMalformedException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
class UserHelper {
    companion object {
        fun getCurrentSession() :UserSession {
            val authentication = SecurityContextHolder.getContext().authentication
            if(authentication != null && authentication is UsernamePasswordAuthenticationToken) {
                val principal = authentication.principal
                if(principal != null && principal is UserSession) {
                    return principal
                }
            }
            throw JwtMalformedException("JWT is malformed and cannot be parsed by user helper")
        }
    }
}
