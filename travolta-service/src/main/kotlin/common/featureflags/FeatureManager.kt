package com.taager.travolta.common.featureflags
import com.taager.travolta.common.configuration.FeatureFlagsConfig.FeatureFlags.*
import io.getunleash.Unleash
import io.getunleash.UnleashContext
import org.springframework.stereotype.Service
@Service
class FeatureManager(private val unleash: Unleash) {
    fun isKinesisEnabled(userId: String) =
        unleash.isEnabled(KINESIS_PUBLISH.flagName, UnleashContext.builder().userId(userId).build())
    fun isMultipleWarehousesEnabled(userId: String) =
        unleash.isEnabled(MULTIPLE_WAREHOUSES.flagName, UnleashContext.builder().userId(userId).build())
    fun isUserManagementEnabled(userId: String) =
        unleash.isEnabled(USER_MANAGEMENT.flagName, UnleashContext.builder().userId(userId).build())
}
