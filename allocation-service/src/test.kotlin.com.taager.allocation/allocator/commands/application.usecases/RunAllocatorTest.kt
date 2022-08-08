package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.contracts.AllocationCompletedPublisher
import com.taager.allocation.allocator.commands.application.contracts.AllocatorUpdatesPublisher
import com.taager.allocation.allocator.commands.application.models.AllocationResultConsolidated
import com.taager.allocation.allocator.commands.domain.contracts.AllocationConfigRepo
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.contracts.ZoneRepo
import com.taager.allocation.allocator.commands.domain.events.AllocationCompleted
import com.taager.allocation.allocator.commands.domain.models.CountryIso
import com.taager.allocation.allocator.commands.domain.models.Order
import com.taager.allocation.allocator.commands.domain.models.OrderId
import com.taager.allocation.allocator.commands.domain.models.Zone
import com.taager.allocation.allocator.commands.domain.services.AllocationResult
import com.taager.allocation.allocator.commands.domain.services.AllocatorService
import com.taager.allocation.sharedkernel.domain.models.Moment
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneName
import io.mockk.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.util.*
internal class RunAllocatorTest {
    private val zoneRepo = mockk<ZoneRepo>()
    private val orderRepo = mockk<OrderRepo>()
    private val allocationConfigRepo = mockk<AllocationConfigRepo>()
    private val allocatorService = mockk<AllocatorService>()
    private val slackPublisherMock = mockk<AllocatorUpdatesPublisher>()
    private val allocationCompletedPublisherMock = mockk<AllocationCompletedPublisher>()
    @Test
    fun `Given allocator is Disabled Then the allocator should not work`() {
        // Given
        every { allocationConfigRepo.allocatorIsEnabled() } answers { false }
        // When
        RunAllocator(orderRepo, zoneRepo, allocationConfigRepo, allocatorService, slackPublisherMock, allocationCompletedPublisherMock).execute()
        // Then
        verify { orderRepo wasNot Called }
        verify { slackPublisherMock wasNot Called }
        verify { allocationCompletedPublisherMock wasNot Called }
        verify { allocatorService wasNot Called }
        verify { zoneRepo wasNot Called }
    }
    @Test
    fun `Given there are no confirmed orders Then the allocator should not continue`() {
        // Given
        every { allocationConfigRepo.allocatorIsEnabled() } answers { true }
        every { orderRepo.getConfirmedOrders(CountryIso("EGY")) } answers { emptyList() }
        every { slackPublisherMock.publishAllocatorRunUpdate(
            AllocationResultConsolidated(
                allocationResult = AllocationResult(allocatedOrders = emptyList(), notAllocatedOrders = emptyList()),
                zones = emptyList()
            )
        ) } answers {  }
        every { slackPublisherMock.publishAllocatorStarted(0) } just Runs
        // When
        RunAllocator(orderRepo, zoneRepo, allocationConfigRepo, allocatorService, slackPublisherMock, allocationCompletedPublisherMock).execute()
        // Then
        verify(exactly = 1) { orderRepo.getConfirmedOrders(CountryIso("EGY")) }
        verify(exactly = 1) { slackPublisherMock.publishAllocatorRunUpdate(
            AllocationResultConsolidated(
                allocationResult = AllocationResult(allocatedOrders = emptyList(), notAllocatedOrders = emptyList()),
                zones = emptyList()
            )
        ) }
        verify { zoneRepo wasNot Called }
        verify { allocationCompletedPublisherMock wasNot Called }
        verify { allocatorService wasNot Called }
    }
    @Test
    fun `Given something went wrong then we should notify tech team through slack`() {
        // Given
        val throwable = Throwable("Test Exception")
        every { slackPublisherMock.publishAllocatorFailed(throwable.stackTraceToString()) } just Runs
        every { allocationConfigRepo.allocatorIsEnabled() }.throws(throwable)
        // When
        RunAllocator(orderRepo, zoneRepo, allocationConfigRepo, allocatorService, slackPublisherMock, allocationCompletedPublisherMock).execute()
        // Then
        verify(exactly = 1) { slackPublisherMock.publishAllocatorFailed(throwable.stackTraceToString()) }
        verify { orderRepo wasNot Called }
        verify { zoneRepo wasNot Called }
        verify { allocatorService wasNot Called }
        verify { allocationCompletedPublisherMock wasNot Called }
    }
    @Test
    fun `Given allocator is Enabled and there are confirmed orders Then the allocator should work`() {
        // Given
        val order = mockk<Order>()
        val order1 = mockk<Order>()
        val order2 = mockk<Order>()
        val zoneId1 = UUID.randomUUID()
        val zoneId2 = UUID.randomUUID()
        val zone1 = mockk<Zone>()
        val zone2 = mockk<Zone>()
        val allocationResult = AllocationResult(listOf(order1,order2), listOf(order))
        val allocationResultConsolidatedSlot = slot<AllocationResultConsolidated>()
        val allocationCompletedSlot = slot<AllocationCompleted>()
        every { order.zoneId } answers { ZoneId(zoneId1) }
        every { order1.zoneId } answers { ZoneId(zoneId2) }
        every { order2.zoneId } answers { ZoneId(zoneId2) }
        every { order.orderId } answers { OrderId("123") }
        every { order1.orderId } answers { OrderId("145") }
        every { order2.orderId } answers { OrderId("431") }
        every { zone1.zoneId } answers { ZoneId(zoneId1) }
        every { zone1.name } answers { ZoneName("zone_1") }
        every { zone2.zoneId } answers { ZoneId(zoneId2) }
        every { zone2.name } answers { ZoneName("zone_2") }
        every { allocationConfigRepo.allocatorIsEnabled() } answers { true }
        every { orderRepo.getConfirmedOrders(CountryIso("EGY")) } answers { listOf(order, order1, order2) }
        every { zoneRepo.getZonesByIds(listOf(ZoneId(zoneId1), ZoneId(zoneId2))) } answers { listOf(zone1,zone2) }
        every { allocatorService.allocate(listOf(order,order1, order2), listOf(zone1,zone2)) } answers { allocationResult }
        every {  orderRepo.saveAll(listOf(order1,order2)) } just Runs
        every { slackPublisherMock.publishAllocatorRunUpdate(capture(allocationResultConsolidatedSlot)) } just Runs
        every { slackPublisherMock.publishAllocatorStarted(3) } just Runs
        every { slackPublisherMock.publishAllocatorRunUpdate(capture(allocationResultConsolidatedSlot)) } just Runs
        every { allocationCompletedPublisherMock.publish(capture(allocationCompletedSlot)) } just Runs
        // When
        RunAllocator(orderRepo, zoneRepo, allocationConfigRepo, allocatorService, slackPublisherMock, allocationCompletedPublisherMock).execute()
        // Then
        val allocationResultConsolidated = allocationResultConsolidatedSlot.captured
        assertThat(allocationResultConsolidated).isEqualTo(AllocationResultConsolidated(
            allocationResult = AllocationResult(
                allocatedOrders = listOf(order1, order2),
                notAllocatedOrders = listOf(order)
            ),
            zones = listOf(zone1,zone2)
        ))
        verify(exactly = 1) { allocationCompletedPublisherMock.publish(any()) }
        val allocationCompleted = allocationCompletedSlot.captured
        assertThat(allocationCompleted.completedAt).isBetween(Moment.now().plus(-10 * 1000L), Moment.now())
        verifyOrder {
            allocationConfigRepo.allocatorIsEnabled()
            orderRepo.getConfirmedOrders(CountryIso("EGY"))
            zoneRepo.getZonesByIds(listOf(ZoneId(zoneId1), ZoneId(zoneId2)))
            allocatorService.allocate(listOf(order,order1, order2), listOf(zone1,zone2))
            orderRepo.saveAll(listOf(order1,order2))
        }
    }
}