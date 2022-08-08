package com.taager.allocation
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication
@SpringBootApplication(exclude = [UserDetailsServiceAutoConfiguration::class])
@ConfigurationPropertiesScan(basePackageClasses = [AllocationServiceApplication::class])
class AllocationServiceApplication
fun main(args: Array<String>) {
    runApplication<AllocationServiceApplication>(*args)
}