package com.taager.travolta.common.security.jwt
import com.taager.travolta.common.security.UserSessionFactory
import org.springframework.http.HttpHeaders
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
@Component
class JwtTokenFilter(private val jwtTokenService: JwtTokenService, private val userSessionFactory: UserSessionFactory) :
    OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        chain: FilterChain
    ) {
        // Get authorization header and validate
        val header = request.getHeader(HttpHeaders.AUTHORIZATION)
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(request, response)
            return
        }
        // Get jwt token and validate
        val token = header.split("\\s+".toRegex())[1]
        if (!jwtTokenService.validate(token)) {
            chain.doFilter(request, response)
            return
        }
        // Get user identity and set it on the spring security context
        val userDetails = userSessionFactory.buildFrom(token)
        val authentication = UsernamePasswordAuthenticationToken(
            userDetails, null, null
        )
        authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
        SecurityContextHolder.getContext().authentication = authentication
        chain.doFilter(request, response)
    }
}
