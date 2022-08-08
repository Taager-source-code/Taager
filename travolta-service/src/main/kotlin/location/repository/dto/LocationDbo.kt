package com.taager.travolta.location.repository.dbo
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
@Document(collection = "locations")
data class LocationDbo(
    @Id val id: String? = null,
    val barcode: String,
    val warehouseCode: String? = null,
    val isPickable: Boolean,
    val metadata: LocationMetadataDbo,
    var variants: List<LocationVariantDbo>
) {
    @CreatedDate
    var createdAt: Long? = null
    @LastModifiedDate
    var updatedAt: Long? = null
}
data class LocationMetadataDbo(
    val aisle: String
)
data class LocationVariantDbo(
    @Indexed val variantId: String,
    val quantity: Int
)
