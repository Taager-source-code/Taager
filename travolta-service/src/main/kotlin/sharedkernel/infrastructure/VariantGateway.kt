package com.taager.travolta.sharedkernel.infrastructure.gateway.variant.configuration
import com.fasterxml.jackson.databind.ObjectMapper
import com.taager.travolta.sharedkernel.infrastructure.gateway.variant.VariantGatewayInternal
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import retrofit2.Retrofit
import retrofit2.converter.jackson.JacksonConverterFactory
@Configuration
class VariantGatewayConfiguration {
    @Bean
    fun variantGatewayInternal(@Value("\${admin.url}") adminUrl: String): VariantGatewayInternal {
        return Retrofit.Builder()
            .baseUrl(adminUrl)
            .addConverterFactory(JacksonConverterFactory.create(ObjectMapper().findAndRegisterModules()))
            .build()
            .create(VariantGatewayInternal::class.java)
    }
}
