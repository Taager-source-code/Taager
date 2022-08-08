package com.taager.travolta.picklist.query.application.converters
import com.taager.travolta.picklist.query.application.contracts.Picklist
import com.taager.travolta.picklist.query.application.contracts.PicklistItemRead
import com.taager.travolta.picklist.query.application.usecases.GettingAssignedPendingPicklistResponse
import com.taager.travolta.picklist.query.application.usecases.PicklistItem
import com.taager.travolta.picklist.query.application.usecases.VariantAttributeDto
import com.taager.travolta.picklist.query.application.usecases.VariantDetails
import com.taager.travolta.variant.domain.Variant
import com.taager.travolta.variant.domain.VariantAttribute
import org.springframework.stereotype.Component
@Component
class PicklistGetPendingAssignedConverter {
    fun toAssignedPendingPicklistResponse(picklist: Picklist, variantsMap: Map<String, Variant>): GettingAssignedPendingPicklistResponse {
        return GettingAssignedPendingPicklistResponse(
            picklistId = picklist.picklistId,
            name = picklist.name,
            items = picklist.items.map { toPickListItem(it, variantsMap) }
        )
    }
    private fun toPickListItem(item: PicklistItemRead, variantsMap: Map<String, Variant>): PicklistItem {
        val variant = variantsMap[item.variantId]
        return PicklistItem(
            itemId = item.itemId,
            variantId = item.variantId,
            variant = variantDetails(variant, item),
            remainingQuantity = item.remainingQuantity,
            status = item.status
        )
    }
    private fun variantDetails(variant: Variant?, item: PicklistItemRead): VariantDetails {
        return if (variant == null) {
            VariantDetails.unknownVariant(item.variantId)
        } else {
            VariantDetails(
                variantId = item.variantId,
                name = variant.name,
                picture = variant.picture,
                attributes = variant.attributes.map { toVariantAttribute(it) }
            )
        }
    }
    private fun toVariantAttribute(attribute: VariantAttribute) = VariantAttributeDto(value = attribute.value, type = attribute.type)
}
