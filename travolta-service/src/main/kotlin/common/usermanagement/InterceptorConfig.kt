package com.taager.travolta.common.usermanagement
import org.springframework.stereotype.Component
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
@Component
class RequiredPrivilegeInterceptorConfig(private val requiredPrivilegeInterceptor: RequiredPrivilegeInterceptor) :
    WebMvcConfigurer {
    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(requiredPrivilegeInterceptor)
    }
}
