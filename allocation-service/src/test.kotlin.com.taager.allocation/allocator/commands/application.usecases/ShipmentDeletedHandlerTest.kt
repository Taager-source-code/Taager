package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.ShipmentDeletedEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.TrackingId
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import java.util.*
class ShipmentDeletedHandlerTest {
    private val orderRepoMock = mockk<OrderRepo>()
    private val shipmentDeletedHandler = ShipmentDeletedHandler(orderRepoMock);
    private val orderMock = mockk<Order>()
    private val shipmentDeletedEvent =  ShipmentDeletedEvent(
            orderId = OrderId(value = "123/456"),
            trackingId = TrackingId(value = "123456")
    )
    @Test
    fun `Order status changed successfully` () {
        // Given
        every { orderRepoMock.getById(shipmentDeletedEvent.orderId) } answers { Optional.of(orderMock)}
        every { orderMock.onShipmentDeleted() } answers {}
        every { orderRepoMock.save(orderMock) } answers {}
        // When
        shipmentDeletedHandler.handle(shipmentDeletedEvent)
        //Then
        verify(exactly = 1) { orderRepoMock.getById(shipmentDeletedEvent.orderId) }
        verify(exactly = 1) { orderMock.onShipmentDeleted() }
        verify(exactly = 1) { orderRepoMock.save(orderMock) }
    }
}