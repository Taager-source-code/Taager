package com.taager.travolta.picklist.common.infrastructure.repositories.db
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.annotation.Version
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
@Document(collection = "picklists")
data class PicklistDbo(
    @Id val id: String,
    @Indexed(unique = true) val name: String,
    val warehouseCode: String,
    val status: String,
    @Indexed val assignedPickerId: String? = null,
    val assignmentsHistory: List<PicklistAssignmentDbo>,
    val items: List<PicklistItemDbo>,
    @CreatedDate val createdAt: Long? = null,
    @LastModifiedDate val updatedAt: Long? = null,
    @Version var version: Long? = null
)
data class PicklistAssignmentDbo(val assignedTo: String, val assignedAt: Long)
data class PicklistItemDbo(val itemId: String, val variantId: String, val remainingQuantity: Int, val status: String, val picks: List<PicklistItemPickDbo> = listOf())
data class PicklistItemPickDbo(val pickedQuantity: Int, val locationBarCode: String, val pickedBy: String, val pickedAt: Long)
