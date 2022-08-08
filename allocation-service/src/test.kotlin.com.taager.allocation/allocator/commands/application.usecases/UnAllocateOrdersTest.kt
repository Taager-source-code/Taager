package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.UnAllocateOrdersRequest
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.OrderId
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
class UnAllocateOrdersTest {
    private val orderRepoMock = mockk<OrderRepo>()
    private val unAllocateOrders = UnAllocateOrders(orderRepoMock);
    private val orderMock = mockk<Order>()
    private val orderMock1 = mockk<Order>()
    @Test
    fun `Correct repo and domain methods called, all orders present in DB` () {
        // Given
        val request = UnAllocateOrdersRequest(
            orderIds = listOf(OrderId("123/345"), OrderId("123/123"))
        )
        every { orderRepoMock.getByIds(request.orderIds) } answers { listOf(orderMock,orderMock1) }
        every { orderMock.unAllocate() } answers {}
        every { orderMock1.unAllocate() } answers {}
        every { orderMock.orderId } answers {request.orderIds[0]}
        every { orderMock1.orderId } answers {request.orderIds[1]}
        every { orderRepoMock.saveAll(listOf(orderMock,orderMock1)) } answers {}
        // When
        val orderResponse = unAllocateOrders.execute(request)
        //Then
        assertThat(orderResponse.size).isEqualTo(0)
        verify(exactly = 1) { orderRepoMock.getByIds(request.orderIds) }
        verify(exactly = 1) { orderMock.unAllocate() }
        verify(exactly = 1) { orderMock1.unAllocate() }
        verify(exactly = 1) { orderRepoMock.saveAll(listOf(orderMock,orderMock1)) }
    }
    @Test
    fun `Correct repo and domain methods called, one order missing in DB` () {
        // Given
        val request = UnAllocateOrdersRequest(
            orderIds = listOf(OrderId("123/345"), OrderId("123/123"))
        )
        every { orderRepoMock.getByIds(request.orderIds) } answers { listOf(orderMock) }
        every { orderMock.unAllocate() } answers {}
        every { orderMock.orderId } answers {request.orderIds[0]}
        every { orderRepoMock.saveAll(listOf(orderMock)) } answers {}
        // When
        val orderResponse = unAllocateOrders.execute(request)
        //Then
        assertThat(orderResponse.size).isEqualTo(1)
        assertThat(orderResponse[0].value).isEqualTo(request.orderIds[1].value)
        verify(exactly = 1) { orderRepoMock.getByIds(request.orderIds) }
        verify(exactly = 1) { orderMock.unAllocate() }
        verify(exactly = 1) { orderRepoMock.saveAll(listOf(orderMock)) }
    }
}