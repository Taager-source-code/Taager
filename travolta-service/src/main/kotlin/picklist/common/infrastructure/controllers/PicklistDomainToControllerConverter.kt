package com.taager.travolta.picklist.common.infrastructure.controllers.converters
import com.taager.travolta.openapi.model.AssignedPicklistItemDto
import com.taager.travolta.openapi.model.AssignedPicklistItemVariantDto
import com.taager.travolta.openapi.model.VariantAttributesDto
import com.taager.travolta.picklist.common.domain.models.PicklistItemStatus
import com.taager.travolta.picklist.common.infrastructure.controllers.GettingAssignedPendingPicklistResponseDto
import com.taager.travolta.picklist.query.application.usecases.GettingAssignedPendingPicklistResponse
import com.taager.travolta.picklist.query.application.usecases.VariantAttributeDto
import com.taager.travolta.picklist.query.application.usecases.VariantDetails
import org.springframework.stereotype.Component
@Component
class PicklistDomainToControllerConverter {
    fun convert(response: GettingAssignedPendingPicklistResponse): GettingAssignedPendingPicklistResponseDto {
        return GettingAssignedPendingPicklistResponseDto(
            id = response.picklistId,
            name = response.name,
            items = response.items.map {
                AssignedPicklistItemDto(
                    itemId = it.itemId,
                    status = getAssignedPicklistItemDtoStatusFromPicklistItemStatus(it.status),
                    variantId = it.variantId,
                    variant = toPicklistItemVariantDto(it.variant),
                    remainingQuantity = it.remainingQuantity
                )
            }
        )
    }
    private fun getAssignedPicklistItemDtoStatusFromPicklistItemStatus(picklistItemStatus: PicklistItemStatus): AssignedPicklistItemDto.Status {
        return when (picklistItemStatus) {
            PicklistItemStatus.PENDING -> AssignedPicklistItemDto.Status.pending
            PicklistItemStatus.PICKED -> AssignedPicklistItemDto.Status.picked
            PicklistItemStatus.PARTIALLY_PICKED -> AssignedPicklistItemDto.Status.partiallyPicked
            PicklistItemStatus.NOT_FOUND -> AssignedPicklistItemDto.Status.notFound
        }
    }
    private fun toPicklistItemVariantDto(variant: VariantDetails) =
        AssignedPicklistItemVariantDto(
            variantId = variant.variantId,
            name = variant.name,
            picture = variant.picture,
            attributes = variant.attributes.map { toPicklistItemVariantAttributesDto(it) })
    private fun toPicklistItemVariantAttributesDto(variantAttributeDto: VariantAttributeDto) =
        VariantAttributesDto(value = variantAttributeDto.value, type = variantAttributeDto.type)
}