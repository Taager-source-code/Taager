package com.taager.cronservice.infrastructure
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
@SpringBootApplication
@EnableCaching
class CronServiceApplication
fun main(args: Array<String>) {
    runApplication<CronServiceApplication>(*args)
}