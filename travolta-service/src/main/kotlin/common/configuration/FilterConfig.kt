package com.taager.travolta.common.configuration
import com.amazonaws.auth.DefaultAWSCredentialsProviderChain
import com.amazonaws.regions.Regions
import com.amazonaws.services.kinesisfirehose.AmazonKinesisFirehose
import com.amazonaws.services.kinesisfirehose.AmazonKinesisFirehoseClientBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
@Configuration
class KinesisConfig {
    @Bean
    fun buildAmazonKinesis(): AmazonKinesisFirehose {
        return AmazonKinesisFirehoseClientBuilder.standard()
            .withCredentials(DefaultAWSCredentialsProviderChain())
            .withRegion(Regions.EU_WEST_1)
            .build()
    }
}
