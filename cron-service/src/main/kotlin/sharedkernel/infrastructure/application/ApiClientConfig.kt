package com.taager.cronservice.infrastructure.sharedkernel.infrastructure.configuration
import io.netty.handler.logging.LogLevel
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.ClientResponse
import org.springframework.web.reactive.function.client.ExchangeFilterFunction
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import reactor.netty.http.client.HttpClient
import reactor.netty.transport.logging.AdvancedByteBufFormat
import java.util.function.Consumer
@Configuration
class ApiClientConfig {
    private val logger: Logger = LoggerFactory.getLogger(this::class.java)
    private fun httpClient(): HttpClient {
        return HttpClient
            .create()
            .wiretap(
                "reactor.netty.http.client.HttpClient",
                LogLevel.DEBUG, AdvancedByteBufFormat.TEXTUAL
            )
    }
    @Bean
    fun reactiveWebClient(): WebClient {
        return WebClient.builder()
            .clientConnector(ReactorClientHttpConnector(httpClient()))
            .filter(logRequest())
            .filter(logResponse())
            .build()
    }
    /**
     * This method returns filter function which will log request data
     * and headers
     **/
    private fun logRequest(): ExchangeFilterFunction {
        return ExchangeFilterFunction.ofRequestProcessor { clientRequest ->
            logger.info(
                "Request: {} {} {}",
                clientRequest.method(),
                clientRequest.url(), clientRequest.body()
            )
            clientRequest.headers()
                .forEach { name, values -> values.forEach { value -> logger.info("{}={}", name, value) } }
            Mono.just(clientRequest)
        }
    }
    // This method returns filter function which will log response data
    private fun logResponse(): ExchangeFilterFunction {
        return ExchangeFilterFunction.ofResponseProcessor { clientResponse: ClientResponse ->
            logger.info("Response status: {}", clientResponse.statusCode())
            clientResponse.headers().asHttpHeaders()
                .forEach { name: String?, values: List<String?> ->
                    values.forEach(
                        Consumer { value: String? ->
                            logger.info(
                                "{}={}",
                                name,
                                value
                            )
                        })
                }
            Mono.just(clientResponse)
        }
    }
}