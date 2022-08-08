package com.taager.allocation.sharedkernel.infrastructure.security
import io.jsonwebtoken.*
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.stereotype.Component
import javax.servlet.http.HttpServletRequest
@Component
class JwtTokenValidator(
    @Value("\${admin.jwt.secret}") private val jwtSecret: String
) {
    private val log = LoggerFactory.getLogger(JwtTokenValidator::class.java)
    fun validate(request: HttpServletRequest): Boolean {
        // Get authorization header and validate
        val header = request.getHeader(HttpHeaders.AUTHORIZATION)
        if (header == null || !header.startsWith("Bearer ")) {
            return false
        }
        // Get jwt token and validate
        val token = header.split("\\s+".toRegex())[1]
        if (!verify(token)) {
            return false
        }
        return true
    }
    private fun verify(token: String?): Boolean {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token)
            return true
        } catch (ex: SignatureException) {
            log.error("Invalid JWT signature - {}", ex.message)
        } catch (ex: MalformedJwtException) {
            log.error("Invalid JWT token - {}", ex.message)
        } catch (ex: ExpiredJwtException) {
            log.error("Expired JWT token - {}", ex.message)
        } catch (ex: UnsupportedJwtException) {
            log.error("Unsupported JWT token - {}", ex.message)
        } catch (ex: IllegalArgumentException) {
            log.error("JWT claims string is empty - {}", ex.message)
        }
        return false
    }
}