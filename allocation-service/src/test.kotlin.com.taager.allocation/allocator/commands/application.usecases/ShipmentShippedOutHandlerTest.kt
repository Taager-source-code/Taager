package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.ShipmentShippedOutEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.UpdateTime
import com.taager.allocation.sharedkernel.domain.models.Moment
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Test
import java.time.Instant
import java.util.*
class ShipmentShippedOutHandlerTest {
    private val orderRepoMock = mockk<OrderRepo>()
    private val shipmentsShippedOutHandler = ShipmentsShippedOutHandler(orderRepoMock);
    private val orderMock = mockk<Order>()
    private val shipmentShippedOutEvent =  ShipmentShippedOutEvent(
            orderId = OrderId(value = "123/456"),
            updatedAt = UpdateTime(value = Moment(Instant.now().toEpochMilli()))
    )
    @Test
    fun `Order status changed successfully` () {
        // Given
        every { orderRepoMock.getById(shipmentShippedOutEvent.orderId) } answers { Optional.of(orderMock)}
        every { orderMock.onShipmentShippedOut(shipmentShippedOutEvent.updatedAt.value) } answers {}
        every { orderRepoMock.save(orderMock) } answers {}
        // When
        shipmentsShippedOutHandler.handle(shipmentShippedOutEvent)
        //Then
        verify(exactly = 1) { orderRepoMock.getById(shipmentShippedOutEvent.orderId) }
        verify(exactly = 1) { orderMock.onShipmentShippedOut(shipmentShippedOutEvent.updatedAt.value) }
        verify(exactly = 1) { orderRepoMock.save(orderMock) }
    }
}