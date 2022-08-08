package com.taager.allocation.allocator.commands.infrastructure.publishers.slack
import com.slack.api.Slack
import com.slack.api.SlackConfig
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
@Configuration
class SlackConfig{
    @Bean
    fun slack(@Value("\${slack.timeout-in-millis}") timeoutInMillis : Int) : Slack {
        val config = SlackConfig()
        config.httpClientCallTimeoutMillis = timeoutInMillis
        config.httpClientWriteTimeoutMillis = timeoutInMillis
        config.httpClientReadTimeoutMillis = timeoutInMillis
        return Slack.getInstance(config)
    }
}
