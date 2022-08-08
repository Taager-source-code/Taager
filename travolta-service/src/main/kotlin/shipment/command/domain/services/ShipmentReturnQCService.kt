package com.taager.travolta.shipment.command.domain.services
import com.taager.travolta.sharedkernel.domain.models.LocationBarCode
import com.taager.travolta.sharedkernel.domain.models.UserId
import com.taager.travolta.sharedkernel.domain.models.WarehouseCode
import com.taager.travolta.shipment.command.application.usecases.ShipmentScannedReturnQCCheckedRequest
import com.taager.travolta.shipment.command.domain.contracts.LocationReturnedVariantAdderUseCase
import com.taager.travolta.shipment.command.domain.contracts.LocationReturnedVariantUpdateDto
import com.taager.travolta.shipment.command.domain.models.shipment.Quantity
import com.taager.travolta.shipment.command.domain.models.shipment.ReturnQCStatus
import com.taager.travolta.shipment.command.domain.models.shipment.Shipment
import com.taager.travolta.shipment.command.domain.models.shipment.VariantId
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
@Component
class ShipmentReturnQCService(
    private val locationReturnedVariantAdderUseCase: LocationReturnedVariantAdderUseCase
) {
    private val logger = LoggerFactory.getLogger(ShipmentReturnQCService::class.java)
    // TODO: Extract them in env variables
    private val successfulLocationBarCode = LocationBarCode("H04-RTN-GOOD")
    private val damagedLocationBarCode = LocationBarCode("H04-RTN-DMG")
    private val partiallyDamagedLocationBarCode = LocationBarCode("H04-RTN-PART-DMG")
    private val defaultWarehouse = "H04"
    private val returnStatusToLocation = mapOf(
        ReturnQCStatus.SUCCESSFUL to successfulLocationBarCode,
        ReturnQCStatus.DAMAGED to damagedLocationBarCode,
        ReturnQCStatus.PARTIALLY_DAMAGED to partiallyDamagedLocationBarCode
    )
    fun returnQCChecked(shipment: Shipment, request: ShipmentScannedReturnQCCheckedRequest) {
        shipment.returnQCChecked(request.userId, request.returnedOrderLines)
        val returnedOrderLines = shipment.returnQCDetails?.returnedOrderLines ?: return
        for (orderLine in returnedOrderLines){
            for (result in orderLine.results){
                val location = returnStatusToLocation[result.qcStatus] ?: continue
                addToLocation(orderLine.variantId, result.quantity, location, request.userId) }
            }
        logger.debug("Shipment [${request.trackingId}] returned variants are reflected to locations")
    }
    private fun addToLocation(variantId: VariantId, quantity: Quantity, barCode: LocationBarCode, userId: UserId) {
        locationReturnedVariantAdderUseCase.addToLocation(
            LocationReturnedVariantUpdateDto(
                variantId =  variantId,
                userId = userId,
                quantity = quantity,
                locationBarCode =  barCode,
                warehouseCode = WarehouseCode(defaultWarehouse)
            )
        )
    }
}