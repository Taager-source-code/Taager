package com.taager.travolta.common.security.jwt
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.travolta.auth.domain.User
import com.taager.travolta.common.security.jwt.converter.JwtUserConverter
import com.taager.travolta.common.security.jwt.dto.JwtUser
import io.jsonwebtoken.*
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
private const val WAREHOUSE_CODE = "warehouseCode"
@Component
class JwtTokenService(
    @Value("\${admin.jwt.secret}") private val jwtSecret: String,
    private val objectMapper: ObjectMapper,
    private val jwtUserConverter: JwtUserConverter
) {
    private val log = LoggerFactory.getLogger(JwtTokenService::class.java)
    fun getUser(token: String): User {
        val claims: Claims = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .body
        val userClaim = claims.get("user", Map::class.java)
        val jwtUser = objectMapper.readValue(objectMapper.writeValueAsBytes(userClaim), JwtUser::class.java)
        return jwtUserConverter.convert(jwtUser)
    }
    fun getWarehouseCode(token: String?): String? {
        val claims: Claims = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .body
        return claims.get(WAREHOUSE_CODE, String::class.java)
    }
    fun appendWarehouseCode(token: String, warehouseCode: String?): String {
        val claims = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .body
            .apply {
                set(WAREHOUSE_CODE, warehouseCode)
            }
        val header = Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .header
        return Jwts.builder()
            .addClaims(claims)
            .setHeader(header)
            .signWith(SignatureAlgorithm.HS256, jwtSecret)
            .compact()
    }
    fun validate(token: String?): Boolean {
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
