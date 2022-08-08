package com.taager.allocation.sharedkernel.infrastructure.security
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
@Component
class ApiFilter(
    private val jwtTokenValidator: JwtTokenValidator,
    private val apiTokenValidator: ApiTokenValidator
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        chain: FilterChain
    ) {
        // Select correct validator
        if (request.requestURI.substringAfterLast('/') == "run-allocator") {
            if (!apiTokenValidator.validate(request) && !jwtTokenValidator.validate(request)) {
                chain.doFilter(request, response)
                return
            }
        } else {
           if (!jwtTokenValidator.validate(request)) {
               chain.doFilter(request, response)
               return
           }
        }
        val authentication = UsernamePasswordAuthenticationToken(null, null, null)
        authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
        SecurityContextHolder.getContext().authentication = authentication
        chain.doFilter(request, response)
    }
}
