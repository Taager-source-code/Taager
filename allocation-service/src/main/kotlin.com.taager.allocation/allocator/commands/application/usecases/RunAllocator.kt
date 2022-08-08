package com.taager.allocation.allocator.commands.application.usecases
import com.taager.allocation.allocator.commands.application.contracts.AllocationCompletedPublisher
import com.taager.allocation.allocator.commands.application.contracts.AllocatorUpdatesPublisher
import com.taager.allocation.allocator.commands.application.models.AllocationResultConsolidated
import com.taager.allocation.allocator.commands.domain.contracts.AllocationConfigRepo
import com.taager.allocation.allocator.commands.domain.contracts.OrderRepo
import com.taager.allocation.allocator.commands.domain.contracts.ZoneRepo
import com.taager.allocation.allocator.commands.domain.events.AllocationCompleted
import com.taager.allocation.allocator.commands.domain.models.CountryIso
import com.taager.allocation.allocator.commands.domain.services.AllocationResult
import com.taager.allocation.allocator.commands.domain.services.AllocatorService
import com.taager.allocation.sharedkernel.application.UseCaseWithoutRequest
import com.taager.allocation.sharedkernel.domain.models.Moment
import org.springframework.stereotype.Service
import javax.transaction.Transactional
@Service
@Transactional
class RunAllocator(
    val orderRepo: OrderRepo,
    val zoneRepo: ZoneRepo,
    val allocationConfigRepo: AllocationConfigRepo,
    val allocatorService: AllocatorService,
    val slackPublisher: AllocatorUpdatesPublisher,
    val allocationCompletedPublisher: AllocationCompletedPublisher,
) : UseCaseWithoutRequest<Unit>() {
    override fun execute() {
        logger.info("Start the allocator process..")
        try {
            if (!allocationConfigRepo.allocatorIsEnabled()) return
            val confirmedOrders = orderRepo.getConfirmedOrders(CountryIso("EGY"))
            slackPublisher.publishAllocatorStarted(confirmedOrders.size)
            if (confirmedOrders.isEmpty()) {
                slackPublisher.publishAllocatorRunUpdate(
                   AllocationResultConsolidated(
                      allocationResult =  AllocationResult(allocatedOrders = emptyList(), notAllocatedOrders = emptyList()),
                       zones = mutableListOf()
                   )
                )
                return
            }
            logger.info("Start allocating ${confirmedOrders.count()} orders")
            val zonesIds = confirmedOrders.distinctBy { it.zoneId }.map { it.zoneId }
            val zones = zoneRepo.getZonesByIds(zonesIds)
            logger.info("Allocating orders in ${zones.count()} zones")
            val result = allocatorService.allocate(confirmedOrders, zones)
            orderRepo.saveAll(result.allocatedOrders)
            logger.info("Allocated orders  ${result.allocatedOrders.map { it.orderId.value }}, notAllocatedOrders: ${result.notAllocatedOrders.map { it.orderId.value }}")
            slackPublisher.publishAllocatorRunUpdate(AllocationResultConsolidated(
                allocationResult =  result,
                zones = zones
            ))
            allocationCompletedPublisher.publish(AllocationCompleted(completedAt = Moment.now()))
        }
        catch (exc: Throwable){
            logger.error("Error while allocating orders: ${exc.stackTraceToString()}")
            slackPublisher.publishAllocatorFailed(exc.stackTraceToString())
        }
    }
}