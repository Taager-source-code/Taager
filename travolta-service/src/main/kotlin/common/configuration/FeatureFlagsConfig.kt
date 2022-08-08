package com.taager.travolta.common.configuration
import io.getunleash.DefaultUnleash
import io.getunleash.Unleash
import io.getunleash.util.UnleashConfig
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
@Configuration
class FeatureFlagsConfig {
    @Bean
    fun unleash(@Value("\${gitlab.feature-flags.url}") url: String,
                @Value("\${gitlab.feature-flags.instance-id}") instanceId: String,
                @Value("\${gitlab.feature-flags.app-name}") appName: String) : Unleash {
        val config = UnleashConfig.builder()
            .appName(appName)
            .instanceId(instanceId)
            .unleashAPI(url)
            .build()
        return DefaultUnleash(config)
    }
    enum class FeatureFlags(val flagName: String){
        KINESIS_PUBLISH("kinesis-publish"),
        MULTIPLE_WAREHOUSES("multiple-warehouses"),
        USER_MANAGEMENT("user-management")
    }
}
