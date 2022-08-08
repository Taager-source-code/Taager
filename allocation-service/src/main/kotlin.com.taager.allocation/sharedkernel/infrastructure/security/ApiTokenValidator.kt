package com.taager.allocation.sharedkernel.infrastructure.security
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.stereotype.Component
import javax.servlet.http.HttpServletRequest
@Component
class ApiTokenValidator(
    @Value("\${admin.api.key}") private val apiKey: String
) {
    private val log = LoggerFactory.getLogger(ApiTokenValidator::class.java)
    fun validate(request: HttpServletRequest): Boolean {
        val header = request.getHeader(HttpHeaders.AUTHORIZATION)
        if (header == null || !header.startsWith("Basic ")) {
            return false
        }
        // Validate the key sent
        val key = header.split("\\s+".toRegex())[1]
        if (key != apiKey) {
            return false
        }
        return true
    }
}
