package com.taager.travolta.shipment.command.domain.models.shipment
import com.taager.ddd.models.base.AggregateRoot
import com.taager.travolta.sharedkernel.domain.models.Moment
import com.taager.travolta.sharedkernel.domain.models.UserId
import com.taager.travolta.shipment.command.domain.events.ShipmentDelayedEvent
import com.taager.travolta.shipment.command.domain.events.ShipmentReadyToShipEvent
import com.taager.travolta.shipment.command.domain.events.ShipmentReturnedEvent
import com.taager.travolta.shipment.command.domain.events.ShipmentShippedOutEvent
import com.taager.travolta.shipment.command.domain.exceptions.IllegalShipmentTransitionException
import com.taager.travolta.shipment.command.domain.exceptions.ShipmentVariantMissingException
import com.taager.travolta.shipment.command.domain.exceptions.ShipmentVariantUnexpectedException
import com.taager.travolta.shipment.command.domain.exceptions.VariantQuantityMismatchException
import com.taager.travolta.shipment.common.domain.models.ShipmentStatus
import com.taager.travolta.shipment.common.domain.models.ShipmentStatus.*
import java.util.*
class Shipment(
    val orderId: OrderId,
    val trackingId: TrackingId,
    val shippingCompany: ShippingCompany,
    val orderLines: List<OrderLine>,
    private val stateTracking: MutableList<StateTracking>,
    returnQCDetails: ReturnQCDetails? = null
) : AggregateRoot<TrackingId>(trackingId) {
    var returnQCDetails: ReturnQCDetails? = returnQCDetails
        private set
    companion object {
        fun new(orderId: OrderId,
                trackingId: TrackingId,
                shippingCompany: ShippingCompany,
                orderLines: List<OrderLine>,
                createdAt: Moment): Shipment {
            return Shipment(
                orderId = orderId,
                trackingId = trackingId,
                shippingCompany = shippingCompany,
                orderLines = orderLines,
                stateTracking = mutableListOf(StateTracking.created(createdAt = createdAt))
            )
        }
    }
    fun readyToShip(userId: UserId){
        assertShipmentTransition(READY_TO_SHIP)
        val history = StateTracking.readyToShip(userId)
        stateTracking.add(history)
        raiseEvent(ShipmentReadyToShipEvent(this.trackingId, this.orderId, history.createdAt))
    }
    fun shippedOut(userId: UserId){
        assertShipmentTransition(SHIPPED_OUT)
        val history = StateTracking.shippedOut(userId)
        stateTracking.add(history)
        raiseEvent(ShipmentShippedOutEvent(this.trackingId, this.orderId, history.createdAt))
    }
    fun returned(userId: UserId, packageSealed: PackageSealed){
        assertShipmentTransition(RETURNED)
        val history = StateTracking.returned(userId)
        stateTracking.add(history)
        this.returnQCDetails = ReturnQCDetails(packageSealed = packageSealed, returnedOrderLines = emptyList())
        raiseEvent(ShipmentReturnedEvent(this.trackingId, this.orderId, history.createdAt))
    }
    fun returnQCChecked(userId: UserId, returnedOrderLines: List<ReturnedOrderLine>){
        assertShipmentTransition(RETURNED_QC_CHECKED)
        val returnQCCheckedState = StateTracking.returnQCChecked(userId)
        stateTracking.add(returnQCCheckedState)
        assertMatchingReturnedOrderLines(returnedOrderLines)
        this.returnQCDetails?.returnedOrderLines = returnedOrderLines
    }
    fun delayed(userId: UserId){
        assertShipmentTransition(DELAYED)
        val history = StateTracking.delayed(userId)
        stateTracking.add(history)
        raiseEvent(ShipmentDelayedEvent(this.trackingId, this.orderId, history.createdAt))
    }
    private fun mapOfReturnedOrderLines(returnedOrderLines: List<ReturnedOrderLine>): MutableMap<VariantId, List<ReturnedQuantityResult>> {
        val returnedOrderLinesMap = mutableMapOf<VariantId, List<ReturnedQuantityResult>>()
        returnedOrderLines.map { orderLine ->
            returnedOrderLinesMap[orderLine.variantId] = orderLine.results
        }
        return returnedOrderLinesMap
    }
    private fun assertMatchingReturnedOrderLines(returnedOrderLines: List<ReturnedOrderLine>) {
        val returnedOrderLinesMap = mapOfReturnedOrderLines(returnedOrderLines)
        for (orderLine in orderLines) {
            val orderLineVariantId = orderLine.variantId
            val correspondingReturnedOrderLine = returnedOrderLinesMap[orderLineVariantId]
            if (correspondingReturnedOrderLine == null){
                if (orderLine.quantity != Quantity(0) ) {
                    throw ShipmentVariantMissingException(trackingId, orderLineVariantId)
                }
            }else{
                val returnedQuantity = correspondingReturnedOrderLine.fold(Quantity.empty()) { acc, next -> acc + next.quantity }
                if (orderLine.quantity != returnedQuantity)
                    throw VariantQuantityMismatchException(trackingId, orderLineVariantId, returnedQuantity)
            }
        }
        if (returnedOrderLinesMap.count() > orderLines.count { it.quantity != Quantity(0) }) {
            orderLines.map { returnedOrderLinesMap.remove(it.variantId) }
            throw ShipmentVariantUnexpectedException(trackingId, returnedOrderLinesMap.keys.toList())
        }
    }
    private fun assertShipmentTransition(targetStatus: ShipmentStatus) {
        if (transitionAllowedTo(targetStatus))
            throw IllegalShipmentTransitionException(trackingId, currentStatus(), targetStatus, currentStateTracking().createdAt)
    }
    // TODO: Fix it (remove the not). Also, Use when instead of the map in allowedTransitions.
    private fun transitionAllowedTo(targetStatus: ShipmentStatus) = allowedTransitions.getOrDefault(currentStatus(), listOf()).contains(targetStatus).not()
    fun currentStatus() = currentStateTracking().status
    private fun currentStateTracking() = getStateTracking().sortedBy { it.createdAt }.last()
    fun getStateTracking(): MutableList<StateTracking> = Collections.unmodifiableList(stateTracking)
    private val allowedTransitions = mapOf(
        CREATED to listOf(READY_TO_SHIP, SHIPPED_OUT, DELAYED),
        DELAYED to listOf(READY_TO_SHIP, SHIPPED_OUT),
        READY_TO_SHIP to listOf(SHIPPED_OUT),
        SHIPPED_OUT to listOf(RETURNED),
        RETURNED to listOf(RETURNED_QC_CHECKED),
        RETURNED_QC_CHECKED to listOf()
    )
}
data class StateTracking(val createdAt: Moment, val status: ShipmentStatus, val userId: UserId) {
    companion object {
        fun created(createdAt: Moment): StateTracking = StateTracking(createdAt = createdAt, status = CREATED, userId = UserId("system"))
        fun readyToShip(userId: UserId): StateTracking = StateTracking(createdAt = Moment.now(), status = READY_TO_SHIP, userId = userId)
        fun shippedOut(userId: UserId): StateTracking = StateTracking(createdAt = Moment.now(), status = SHIPPED_OUT, userId = userId)
        fun returned(userId: UserId): StateTracking = StateTracking(createdAt = Moment.now(), status = RETURNED, userId = userId)
        fun delayed(userId: UserId): StateTracking = StateTracking(createdAt = Moment.now(), status = DELAYED, userId = userId)
        fun returnQCChecked(userId: UserId): StateTracking = StateTracking(createdAt = Moment.now(), status = RETURNED_QC_CHECKED, userId = userId)
    }
}
data class ReturnQCDetails(val packageSealed: PackageSealed,
                           var returnedOrderLines: List<ReturnedOrderLine>)
data class ReturnedOrderLine(val variantId: VariantId, val results: List<ReturnedQuantityResult>)
data class ReturnedQuantityResult(val quantity: Quantity, val qcStatus: ReturnQCStatus)
