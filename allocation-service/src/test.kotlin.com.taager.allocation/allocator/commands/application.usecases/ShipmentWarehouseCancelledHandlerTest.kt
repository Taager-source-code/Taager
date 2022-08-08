package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.ShipmentWarehouseCancelledEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.TrackingId
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import java.util.*
class ShipmentWarehouseCancelledHandlerTest {
    private val orderRepoMock = mockk<OrderRepo>()
    private val shipmentWarehouseCancelledHandler = ShipmentWarehouseCancelledHandler(orderRepoMock);
    private val orderMock = mockk<Order>()
    private val shipmentWarehouseCancelledEvent =  ShipmentWarehouseCancelledEvent(
            orderId = OrderId(value = "123/456"),
            trackingId = TrackingId(value = "123456")
    )
    @Test
    fun `Order status changed successfully` () {
        // Given
        every { orderRepoMock.getById(shipmentWarehouseCancelledEvent.orderId) } answers { Optional.of(orderMock)}
        every { orderMock.onWarehouseCanceled() } answers {}
        every { orderRepoMock.save(orderMock) } answers {}
        // When
        shipmentWarehouseCancelledHandler.handle(shipmentWarehouseCancelledEvent)
        //Then
        verify(exactly = 1) { orderRepoMock.getById(shipmentWarehouseCancelledEvent.orderId) }
        verify(exactly = 1) { orderMock.onWarehouseCanceled() }
        verify(exactly = 1) { orderRepoMock.save(orderMock) }
    }
}