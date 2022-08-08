package com.taager.travolta.shipment.common.infrastructure.repositories.db
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.mongodb.core.index.CompoundIndex
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
@Document(collection = "shipments")
@CompoundIndex(def = "{'trackingId' : 1, 'isDeleted': 1}",
               unique = true,
               partialFilter = "{'isDeleted': {'\$eq': false}}")
data class ShipmentDbo(
    @Id val id: String? = null,
    @Indexed val trackingId: String,
    val orderId: String,
    val shippingCompany: String,
    val orderLines: List<ShipmentOrderLineDbo>?,
    val stateTracking: List<ShipmentStateTrackingDbo>,
    val isDeleted: Boolean = false,
    @CreatedDate val createdAt: Long? = null,
    @LastModifiedDate val updatedAt: Long? = null,
    val returnQCDetails: ShipmentReturnQCDetailsDbo? = null
)
data class ShipmentOrderLineDbo(
    val variantId: String,
    val variantName: String,
    val variantPicture: String? = null,
    val attributes: List<OrderLineAttributeDbo>,
    val quantity: Int,
)
data class OrderLineAttributeDbo(
    val type: String,
    val value: String,
)
data class ShipmentStateTrackingDbo(
    val createdAt: Long,
    val status: String,
    val userId: String = "unknown"
)
data class ShipmentReturnQCDetailsDbo(
    val isPackageSealed: Boolean,
    var returnedOrderLines: List<ReturnedOrderLineDbo>? = null
)
data class ReturnedOrderLineDbo(
    val variantId: String,
    val results: List<ReturnedQuantityResultDbo>
)
data class ReturnedQuantityResultDbo(val quantity: Int,
                                     val qcStatus: String)