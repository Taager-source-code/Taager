package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.OrderUnConfirmedEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.OrderId
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.util.*
class OrderUnConfirmedHandlerTest {
    private val orderRepoMock = mockk<OrderRepo>()
    private val orderUnConfirmedHandler = OrderUnConfirmedHandler(orderRepoMock);
    private val orderUnConfirmedEvent =  OrderUnConfirmedEvent (orderId = OrderId(value = "123/456"))
    @Test
    fun `Order removed successfully` () {
        // Given
        val orderCaptureSlot = slot<Order>()
        val orderMock = mockk<Order>();
        every { orderRepoMock.getById(orderUnConfirmedEvent.orderId) } answers { Optional.of(orderMock) }
        every { orderMock.orderId } answers { OrderId("123/456") }
        every { orderRepoMock.delete(capture(orderCaptureSlot)) } answers {}
        // When
        orderUnConfirmedHandler.handle(orderUnConfirmedEvent)
        //Then
        val orderDomainObject = orderCaptureSlot.captured
        verify(exactly = 1) { orderRepoMock.getById(orderUnConfirmedEvent.orderId) }
        verify(exactly = 1) { orderRepoMock.delete(orderMock) }
        assertThat(orderDomainObject.orderId).isEqualTo(orderUnConfirmedEvent.orderId)
    }
}
