package com.taager.travolta.common.reporting.useractions.kinesis
import com.taager.travolta.common.reporting.useractions.domain.*
import com.taager.travolta.common.reporting.useractions.kinesis.model.*
import com.taager.travolta.common.service.TimeService
import org.springframework.stereotype.Service
@Service
class KinesisUserActionConverter(private val timeService: TimeService) {
    fun convert(userAction: UserAction): UserActionKinesisModel {
        val timestamp = timeService.currentTimestamp()
        return when (userAction) {
            is UserLogin -> UserLoginKinesisModel(userId = userAction.userId, timestamp = timestamp)
            is UserLogoff -> UserLogoffKinesisModel(userId = userAction.userId, timestamp = timestamp)
            is VariantAdded -> VariantAddedKinesisModel(
                userId = userAction.userId,
                variantId = userAction.variantId,
                locationId = userAction.locationId,
                quantity = userAction.quantity,
                locationBarCode = userAction.locationBarCode,
                timestamp = timestamp
            )
            is VariantRemoved -> VariantRemovedKinesisModel(
                userId = userAction.userId,
                variantId = userAction.variantId,
                locationId = userAction.locationId,
                locationBarCode = userAction.locationBarCode,
                quantity = userAction.quantity,
                timestamp = timestamp
            )
            is ItemPicked -> ItemPickedKinesisModel(
                    userId = userAction.userId,
                    itemId = userAction.itemId,
                    variantId = userAction.variantId,
                    quantity = userAction.quantity,
                    locationBarCode = userAction.locationBarCode,
                    timestamp = timestamp,
            )
        }
    }
}
