package com.taager.allocation.allocator.commands.infrastructure.publishers.slack
import com.slack.api.Slack
import com.slack.api.methods.request.chat.ChatPostMessageRequest
import com.slack.api.methods.request.files.FilesUploadRequest
import com.taager.allocation.allocator.commands.application.contracts.AllocatorUpdatesPublisher
import com.taager.allocation.allocator.commands.application.models.AllocationResultConsolidated
import com.taager.allocation.allocator.common.infrastructure.db.access.ZoneDao
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.text.SimpleDateFormat
import java.util.*
@Service
class  SlackAllocationPublisher(
    @Value("\${slack.channel}") val channel: String,
    @Value("\${slack.token}") val token: String,
    val zoneDao: ZoneDao,
    val slack: Slack,
    ) : AllocatorUpdatesPublisher {
    companion object {
        protected val logger: Logger = LoggerFactory.getLogger(AllocatorUpdatesPublisher::class.java)
        val simpleDateFormat = SimpleDateFormat("MM-dd-yyyy hh:mm")
    }
    override fun publishAllocatorStarted(ordersToAllocate: Int) {
        slack.methods().chatPostMessage(
            ChatPostMessageRequest.builder()
                .token(token)
                .text("\n----------------------------\n:drum_with_drumsticks: *Allocator Started! - No. of orders to allocate:* *`${ordersToAllocate}`*")
                .channel(channel)
                .build()
        )
    }
    override fun publishAllocatorFailed(reason: String) {
        val date = simpleDateFormat.format(Date())
        slack.methods().filesUpload(
            FilesUploadRequest.builder()
                .token(token)
                .channels(listOf(channel))
                .content(reason)
                .filetype("txt")
                .filename("allocation_error_$date")
                .initialComment("*Allocator* *`Failed`* *to Allocate!*")
                .build()
        )
        val result = slack.methods().chatPostMessage(
            ChatPostMessageRequest.builder()
                .token(token)
                .text("@shipping-backend check :ladybug: :point_up_2:")
                .linkNames(true)
                .channel(channel)
                .build()
        )
        print(result)
    }
    override fun publishAllocatorRunUpdate(result: AllocationResultConsolidated) {
        val messageBuilder = StringBuilder()
        messageBuilder.append("*Allocated Orders*: " + "*`${result.allocationResult.allocatedOrders.size}`* \n")
        messageBuilder.append("*Non-Allocated*: " + "*`${result.allocationResult.notAllocatedOrders.size}`* \n")
        val date = simpleDateFormat.format(Date())
        if (result.allocationResult.allocatedOrders.isNotEmpty()) {
            val csvBuilder = StringBuilder().append("OrderId, CompanyId")
            result.allocationResult.allocatedOrders.forEach {
                csvBuilder.append("\n")
                csvBuilder.append("${it.orderId.value},${it.companyId?.value}")
            }
            slack.methods().filesUpload(
                FilesUploadRequest.builder()
                    .token(token)
                    .channels(listOf(channel))
                    .content(csvBuilder.toString())
                    .filetype("csv")
                    .filename("allocation_result_$date")
                    .initialComment(messageBuilder.toString())
                    .build()
            )
        }
        if (result.allocationResult.notAllocatedOrders.isNotEmpty()) {
            val zonesMap = result.zones.associateBy { it.zoneId }
            val provinceWithZoneMap = zoneDao.getProvinceNamesForZones(result.zones.map { it.zoneId.value }).associateBy { it.getZoneId() }
            val csvBuilder = StringBuilder().append("Province name, Zone Name, non allocated orders")
            result.allocationResult.notAllocatedOrders
                .groupBy({ it.zoneId }, { 1 })
                .mapValues { it.value.sum() }
                .forEach {
                    val zoneName = zonesMap[it.key]?.name?.value
                    val provinceName = provinceWithZoneMap[it.key.value.toString()]?.getProvinceName()
                    csvBuilder.append("\n")
                    csvBuilder.append("${provinceName},${zoneName},${it.value}")
                }
            slack.methods().filesUpload(
                FilesUploadRequest.builder()
                    .token(token)
                    .channels(listOf(channel))
                    .content(csvBuilder.toString())
                    .filetype("csv")
                    .filename("no_cap_orders_$date")
                    .initialComment("*Non-Allocated*: " + "*`${result.allocationResult.notAllocatedOrders.size}`*")
                    .build()
            )
            slack.methods().chatPostMessage(
                ChatPostMessageRequest.builder()
                    .token(token)
                    .text(":alert: @planning-team :point_up_2:")
                    .linkNames(true)
                    .channel(channel)
                    .build()
            )
        }
    }
}