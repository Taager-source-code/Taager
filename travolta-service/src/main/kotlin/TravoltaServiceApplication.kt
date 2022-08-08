package com.taager.travolta
import io.mongock.runner.springboot.EnableMongock
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
@SpringBootApplication(exclude = [UserDetailsServiceAutoConfiguration::class])
@EnableMongock
@EnableCaching
@ConfigurationPropertiesScan(basePackageClasses = [TravoltaServiceApplication::class])
class TravoltaServiceApplication
fun main(args: Array<String>) {
    runApplication<TravoltaServiceApplication>(*args)
}
