package com.taager.wallet.sharedkernel.infrastructure.pulsar
import org.apache.pulsar.client.api.PulsarClient
import org.apache.pulsar.client.impl.auth.oauth2.AuthenticationFactoryOAuth2
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import java.net.URL
@Configuration
@Profile("!test")
class PulsarConfig {
    @Bean
    fun pulsarClient(pulsarProperties: PulsarProperties): PulsarClient {
        return PulsarClient.builder()
            .serviceUrl(pulsarProperties.serviceUrl)
            .authentication(
                AuthenticationFactoryOAuth2.clientCredentials(
                    URL(pulsarProperties.issuerUrl),
                    URL(pulsarFilePath),
                    pulsarProperties.audience
                )
            )
            .build()
    }
    companion object {
        private const val pulsarFilePath = "file:///pulsar_credentials.json"
    }
}
