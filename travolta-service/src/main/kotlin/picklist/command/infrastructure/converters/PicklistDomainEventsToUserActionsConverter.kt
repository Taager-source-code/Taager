package com.taager.travolta.picklist.command.infrastructure.repositories.converters
import com.taager.travolta.common.reporting.useractions.domain.ItemPicked
import com.taager.travolta.picklist.command.domain.events.PicklistItemPicked
import org.springframework.stereotype.Component
@Component
class PicklistDomainEventsToUserActionsConverter {
    fun convert(picklistItemPicked: PicklistItemPicked): ItemPicked{
        return ItemPicked(userId = picklistItemPicked.pickerId.toString(),
                          itemId = picklistItemPicked.itemId.toString(),
                          variantId = picklistItemPicked.variantId.toString(),
                          quantity = picklistItemPicked.quantity.value,
                          locationBarCode = picklistItemPicked.locationBarCode.toString(),
        )
    }
}