package com.taager.travolta.location.domain
import com.taager.travolta.location.service.InsufficientQuantityOnLocationException
import com.taager.travolta.variant.service.VariantNotFoundException
data class Location(
    val id: String? = null,
    val barcode: String,
    val isPickable: Boolean,
    val metadata: LocationMetadata,
    private val variants: MutableList<LocationVariant>,
    val warehouseCode: String?
) {
    var createdAt: Long? = null
    var updatedAt: Long? = null
    fun addVariant(variantToAdd: LocationVariant) {
        val existingVariant = variants.firstOrNull { it.variantId == variantToAdd.variantId }
        if (existingVariant != null) {
            existingVariant.addQuantity(variantToAdd.getQuantity())
        } else {
            variants.add(variantToAdd)
        }
    }
    fun removeVariant(locationVariantUpdate: LocationVariant, removalMode: RemovalMode) {
        when (removalMode) {
            RemovalMode.STRICT -> removeVariantStrict(locationVariantUpdate)
            RemovalMode.FLEXIBLE -> removeVariantFlexible(locationVariantUpdate)
        }
    }
    private fun removeVariantStrict(variantToBeRemoved: LocationVariant) {
        val existingVariant = variants.firstOrNull { it.variantId == variantToBeRemoved.variantId }
            ?: throw VariantNotFoundException("variant not found", variantToBeRemoved.variantId)
        if (existingVariant.getQuantity() < variantToBeRemoved.getQuantity()) {
            throw InsufficientQuantityOnLocationException(
                "Quantity of variant to be removed is greater than currently present in the location",
                id ?: "",
                existingVariant.getQuantity(),
                variantToBeRemoved.getQuantity()
            )
        }
        existingVariant.removeQuantity(variantToBeRemoved.getQuantity())
        if (existingVariant.getQuantity() == 0) variants.removeIf { it.variantId == variantToBeRemoved.variantId }
    }
    private fun removeVariantFlexible(variantToBeRemoved: LocationVariant) {
        val existingVariant = variants.firstOrNull { it.variantId == variantToBeRemoved.variantId } ?: return
        existingVariant.removeQuantity(variantToBeRemoved.getQuantity())
        if (existingVariant.getQuantity() <= 0) variants.removeIf { it.variantId == variantToBeRemoved.variantId }
    }
    fun getVariants() = variants
}
