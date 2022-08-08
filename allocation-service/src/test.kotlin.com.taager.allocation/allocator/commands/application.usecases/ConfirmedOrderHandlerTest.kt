package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.models.OrderConfirmedEvent
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.contracts.ZoneRepo
import com.taager.allocation.allocator.commands.domain.exceptions.ZoneInProvinceNotFoundException
import com.taager.allocation.allocator.commands.domain.models.*
import com.taager.allocation.sharedkernel.domain.models.Moment
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ProvinceName
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneName
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.Instant
import java.util.*
class ConfirmedOrderHandlerTest {
    private val orderRepoMock = mockk<OrderRepo>()
    private val zoneRepoMock = mockk<ZoneRepo>()
    private val confirmedOrderHandler = OrderConfirmedHandler(orderRepoMock, zoneRepoMock);
    private val orderConfirmedEvent =  OrderConfirmedEvent (
         orderId = OrderId(value = "123/456"),
         zoneName = ZoneName(value = "Maadi"),
        provinceName = ProvinceName(value = "Cairo"),
         taagerId = TagerId(value = 123),
         countryIso = CountryIso(value = "EGY"),
         cashOnDelivery = CashOnDelivery(value = 100),
         placedAt = PlacedAt(value = Moment(Instant.now().toEpochMilli())),
         confirmedAt = ConfirmedAt(value = Moment(Instant.now().toEpochMilli())),
         orderLines = mutableListOf(OrderLine(
             productId = ProductId(value = "product-1"),
             price = Price(value = 100),
             quantity = Quantity(value = 1)
         )),
    )
    @Test
    fun `Order status changed successfully` () {
        // Given
        val zoneId = ZoneId(value = UUID.randomUUID())
        val orderCaptureSlot = slot<Order>()
        every { zoneRepoMock.findZoneIdByZoneAndProvince(zoneName = orderConfirmedEvent.zoneName, provinceName = orderConfirmedEvent.provinceName)
        } answers { zoneId}
        every { orderRepoMock.save(capture(orderCaptureSlot)) } answers {}
        // When
        confirmedOrderHandler.handle(orderConfirmedEvent)
        //Then
        val orderDomainObject = orderCaptureSlot.captured
        verify(exactly = 1) { zoneRepoMock.findZoneIdByZoneAndProvince(zoneName = orderConfirmedEvent.zoneName, provinceName = orderConfirmedEvent.provinceName) }
        assertThat(orderDomainObject.orderId).isEqualTo(orderConfirmedEvent.orderId)
        assertThat(orderDomainObject.zoneId).isEqualTo(zoneId)
        assertThat(orderDomainObject.tagerId).isEqualTo(orderConfirmedEvent.taagerId)
        assertThat(orderDomainObject.countryIso).isEqualTo(orderConfirmedEvent.countryIso)
        assertThat(orderDomainObject.placedAt.value).isBetween(Moment.now().plus(-3000), Moment.now())
        assertThat(orderDomainObject.confirmedAt.value).isBetween(Moment.now().plus(-3000), Moment.now())
        assertThat(orderDomainObject.orderLines.size).isEqualTo(1)
    }
    @Test
    fun `ZoneId not found exception thrown, if invalid zoneName` () {
        // Given
        every { zoneRepoMock.findZoneIdByZoneAndProvince(zoneName = orderConfirmedEvent.zoneName, provinceName = orderConfirmedEvent.provinceName)
        } answers { null }
        // Then
        assertThrows<ZoneInProvinceNotFoundException> {
            confirmedOrderHandler.handle(orderConfirmedEvent)
        }
    }
}