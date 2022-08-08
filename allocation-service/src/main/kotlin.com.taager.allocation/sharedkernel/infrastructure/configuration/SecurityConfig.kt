package com.taager.allocation.sharedkernel.infrastructure.configuration
import com.taager.allocation.sharedkernel.infrastructure.security.ApiFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
@Configuration
@Order(70)
class JwtSecurityConfig(private val apiFilter: ApiFilter) : WebSecurityConfigurerAdapter() {
    override fun configure(http: HttpSecurity) {
        val configuredHttp = SecurityConfig.commonHttpSecurityConfig(http)
        // Set permissions on endpoints
        configuredHttp.authorizeRequests()
            .antMatchers("/actuator/health", "/actuator/prometheus").permitAll()
            .anyRequest().authenticated()
        // Add JWT token filter
        configuredHttp.addFilterBefore(
            apiFilter,
            UsernamePasswordAuthenticationFilter::class.java
        )
    }
}
@Configuration
@EnableWebSecurity
class SecurityConfig {
    companion object {
        fun commonHttpSecurityConfig(http: HttpSecurity) : HttpSecurity {
            // Enable CORS and disable CSRF
            var configuredHttp = http
            configuredHttp = configuredHttp.cors().and().csrf().disable()
            // Set session management to stateless
            configuredHttp = configuredHttp
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
            // Set unauthorized requests exception handler
            return configuredHttp
                .exceptionHandling()
                .authenticationEntryPoint { request: HttpServletRequest?, response: HttpServletResponse, ex: AuthenticationException ->
                    response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        ex.message
                    )
                }
                .and()
        }
    }
    // Used by spring security if CORS is enabled.
    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        config.allowCredentials = true
        config.addAllowedOriginPattern("*")
        config.addAllowedHeader("*")
        config.addAllowedMethod("*")
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }
}