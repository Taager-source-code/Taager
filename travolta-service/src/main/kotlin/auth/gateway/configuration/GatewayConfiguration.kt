package com.taager.travolta.auth.gateway.configuration
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.travolta.auth.gateway.LoginGatewayInternal
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import retrofit2.Retrofit
import retrofit2.converter.jackson.JacksonConverterFactory
@Configuration
class GatewayConfiguration {
    @Bean
    fun loginGatewayInternal(@Value("\${admin.url}") adminUrl: String): LoginGatewayInternal {
        return Retrofit.Builder()
            .baseUrl(adminUrl)
            .addConverterFactory(JacksonConverterFactory.create(ObjectMapper().findAndRegisterModules()))
            .build()
            .create(LoginGatewayInternal::class.java)
    }
}
