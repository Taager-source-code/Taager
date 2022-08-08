package com.taager.travolta.picklist.query.application.usecases
import com.taager.travolta.auth.domain.UserSession
import com.taager.travolta.picklist.common.domain.models.PicklistItemStatus
import com.taager.travolta.picklist.query.application.contracts.Picklist
import com.taager.travolta.picklist.query.application.contracts.PicklistQueryRepo
import com.taager.travolta.picklist.query.application.converters.PicklistGetPendingAssignedConverter
import com.taager.travolta.picklist.query.application.exceptions.PickerDoesNotHavePicklistAssignedException
import com.taager.travolta.picklist.query.application.exceptions.PicklistCannotBeAccessedFromDiffWarehouseException
import com.taager.travolta.sharedkernel.domain.contracts.VariantGateway
import com.taager.travolta.variant.domain.Variant
import com.taager.travolta.variant.service.VariantFetchFailedException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
@Service
class GetAssignedPendingPicklist(
    val picklistRepo: PicklistQueryRepo,
    val variantGateway: VariantGateway,
    val picklistGetPendingAssignedConverter: PicklistGetPendingAssignedConverter
) {
    private val logger = LoggerFactory.getLogger(GetAssignedPendingPicklist::class.java)
    fun execute(
        request: GettingAssignedPendingPicklistRequest,
        userSession: UserSession
    ): GettingAssignedPendingPicklistResponse {
        val picklist = getByAssignedPickerIdOrElseThrow(request.pickerId)
        assertOnWarehouse(picklist.picklistId, picklistWarehouseCode = picklist.warehouseCode, sentWarehouseCode = request.warehouseCode)
        val variantsMap = fetchVariants(picklist.items.map { it.variantId }, userSession).associateBy { it.variantId }
        val response = picklistGetPendingAssignedConverter.toAssignedPendingPicklistResponse(picklist, variantsMap)
        logger.debug("Picker [${request.pickerId}] has picklist [${picklist}] assigned ")
        return response
    }
    private fun assertOnWarehouse(picklistId: String, sentWarehouseCode: String, picklistWarehouseCode: String) {
        if (sentWarehouseCode != picklistWarehouseCode) {
            throw PicklistCannotBeAccessedFromDiffWarehouseException(
                picklistId,
                picklistWarehouseCode,
                sentWarehouseCode
            )
        }
    }
    private fun fetchVariants(variantIds: List<String>, userSession: UserSession): List<Variant> {
        try {
            return variantGateway.fetchVariantDetails(variantIds, userSession)
        } catch (ex: VariantFetchFailedException) {
            logger.error("Variant fetch failed while retrieving for picklist get assigned pending, ", ex)
        }
        return listOf()
    }
    private fun getByAssignedPickerIdOrElseThrow(pickerId: String): Picklist {
        val picklist = picklistRepo.getByAssignedPickerId(assignedPickerId = pickerId)
        if (picklist.isEmpty) {
            throw PickerDoesNotHavePicklistAssignedException(pickerId)
        }
        return picklist.get()
    }
}
data class GettingAssignedPendingPicklistRequest(val pickerId: String, val warehouseCode: String)
data class GettingAssignedPendingPicklistResponse(
    val picklistId: String,
    val name: String,
    val items: List<PicklistItem>
)
data class PicklistItem(
    val itemId: String,
    val variantId: String,
    val variant: VariantDetails,
    val remainingQuantity: Int,
    val status: PicklistItemStatus
)
class VariantDetails(
    val variantId: String,
    val name: String,
    val picture: String,
    val attributes: List<VariantAttributeDto>
) {
    companion object {
        fun unknownVariant(variantId: String): VariantDetails {
            return VariantDetails(
                variantId = variantId,
                name = "unknown",
                picture = "unknown",
                attributes = listOf()
            )
        }
    }
}
data class VariantAttributeDto(val value: String, val type: String)