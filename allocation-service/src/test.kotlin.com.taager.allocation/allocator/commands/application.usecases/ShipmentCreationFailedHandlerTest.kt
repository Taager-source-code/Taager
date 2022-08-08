package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.ShipmentCreationFailedEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.valueobjects.ShippingCompany
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.util.*
class ShipmentCreationFailedHandlerTest {
    private val orderRepoMock = mockk<OrderRepo>()
    private val shipmentCreationFailedHandler = ShipmentsCreationFailedHandler(orderRepoMock);
    private val orderMock = mockk<Order>()
    private val orderMock1 = mockk<Order>()
    private val shipmentCreationFailedEvent =  ShipmentCreationFailedEvent(
            shippingCompany = ShippingCompany(value = "vhubs"),
            orderIds = mutableListOf(
                OrderId(value = "123/456"),
                OrderId(value = "123/444")
            )
    )
    @Test
    fun `Order status changed successfully for all orders` () {
        // Given
        val orderListSlot = slot<MutableList<Order>>()
        every { orderRepoMock.getById(shipmentCreationFailedEvent.orderIds[0]) } answers { Optional.of(orderMock)}
        every { orderRepoMock.getById(shipmentCreationFailedEvent.orderIds[1]) } answers { Optional.of(orderMock1)}
        every { orderMock.onShipmentFailedToCreate() } answers {}
        every { orderMock1.onShipmentFailedToCreate() } answers {}
        every { orderRepoMock.saveAll(capture(orderListSlot)) } answers {}
        // When
        shipmentCreationFailedHandler.handle(shipmentCreationFailedEvent)
        //Then
        val orderList = orderListSlot.captured
        assertThat(orderList.size).isEqualTo(2)
        assertThat(orderList[0]).isEqualTo(orderMock)
        assertThat(orderList[1]).isEqualTo(orderMock1)
        verify(exactly = 1) { orderRepoMock.getById(shipmentCreationFailedEvent.orderIds[0]) }
        verify(exactly = 1) { orderRepoMock.getById(shipmentCreationFailedEvent.orderIds[1]) }
        verify(exactly = 1) { orderMock.onShipmentFailedToCreate() }
        verify(exactly = 1) { orderMock1.onShipmentFailedToCreate() }
    }
    @Test
    fun `Order status changed successfully for orders present in DB` () {
        // Given
        val orderListSlot = slot<MutableList<Order>>()
        every { orderRepoMock.getById(shipmentCreationFailedEvent.orderIds[0]) } answers { Optional.of(orderMock)}
        every { orderRepoMock.getById(shipmentCreationFailedEvent.orderIds[1]) } answers { Optional.empty()}
        every { orderMock.onShipmentFailedToCreate() } answers {}
        every { orderRepoMock.saveAll(capture(orderListSlot)) } answers {}
        // When
        shipmentCreationFailedHandler.handle(shipmentCreationFailedEvent)
        //Then
        val orderList = orderListSlot.captured
        assertThat(orderList.size).isEqualTo(1)
        assertThat(orderList[0]).isEqualTo(orderMock)
        verify(exactly = 1) { orderRepoMock.getById(shipmentCreationFailedEvent.orderIds[0]) }
        verify(exactly = 1) { orderRepoMock.getById(shipmentCreationFailedEvent.orderIds[1]) }
        verify(exactly = 1) { orderMock.onShipmentFailedToCreate() }
    }
}