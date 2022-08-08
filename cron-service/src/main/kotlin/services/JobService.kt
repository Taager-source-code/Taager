package com.taager.cronservice.infrastructure.services
import com.taager.cronservice.infrastructure.application.exceptions.ApiFailedException
import com.taager.cronservice.infrastructure.sharedkernel.application.BaseScheduleService
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException
import org.springframework.web.reactive.function.client.awaitBodilessEntity
@Service
class JobService(private val reactiveWebClient: WebClient) : BaseScheduleService() {
    /**
     * TODO:: Prometheus alert in controller advice to raise flag for failing schedule runs
     */
    override suspend fun executeHttp(url: String, authToken: String) {
        try {
            val response: ResponseEntity<Void> = this.reactiveWebClient
                .method(HttpMethod.valueOf("POST"))
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .header(
                    "Authorization", "Basic $authToken"
                )
                .retrieve()
                .awaitBodilessEntity()
            if (response.statusCode.is2xxSuccessful) {
                logger.info("success response status : {}", response.statusCode)
            } else {
                throw ApiFailedException(response.statusCodeValue, response.statusCode.name)
            }
        } catch (ex: WebClientResponseException) {
            throw ApiFailedException(ex.rawStatusCode, ex.localizedMessage)
        }
    }
    override suspend fun executeAsyncMessage(topic: String, authToken: String) {
        TODO("Not yet implemented")
    }
}