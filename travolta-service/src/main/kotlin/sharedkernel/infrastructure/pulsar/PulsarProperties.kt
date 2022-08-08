package com.taager.travolta.sharedkernel.infrastructure.pulsar
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.ConstructorBinding
import org.springframework.context.annotation.Profile
@ConstructorBinding
@ConfigurationProperties(prefix = "pulsar")
@Profile("!test")
data class PulsarProperties(
        val issuerUrl: String,
        val serviceUrl: String,
        val audience: String,
        val credentialsFilePath: String,
)
