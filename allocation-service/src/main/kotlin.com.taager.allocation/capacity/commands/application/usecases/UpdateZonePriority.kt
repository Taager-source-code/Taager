package com.taager.allocation.capacity.commands.application.usecases
import com.taager.allocation.capacity.commands.application.models.UpdateZonePriorityRequest
import com.taager.allocation.capacity.commands.domain.contracts.ProvinceRepo
import com.taager.allocation.capacity.commands.domain.exceptions.ProvinceNotFoundException
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.sharedkernel.application.UseCase
import com.taager.allocation.sharedkernel.domain.models.valueobjects.Capacity
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
import org.springframework.stereotype.Service
@Service
class UpdateZonePriority(private val provinceRepo: ProvinceRepo): UseCase<UpdateZonePriorityRequest, Unit>() {
    override fun execute(request: UpdateZonePriorityRequest) {
        logger.debug("Updating priority in a zone with id of [${request.zoneId}] " +
                "and priority id of [${request.priorityId}]")
        val provinceId = ProvinceId.of(request.provinceId)
        val province = provinceRepo.getById(provinceId).orElseThrow{ProvinceNotFoundException(provinceId)}
        if (request.capacity != null) {
            province.updateZoneCapacity(
                zoneId = ZoneId.of(request.zoneId),
                priorityId = PriorityId.of(request.priorityId),
                capacity = Capacity.of(request.capacity)
            )
        }
        if (request.inTesting != null) {
            province.updateZoneTestingStatus(
                zoneId = ZoneId.of(request.zoneId),
                priorityId = PriorityId.of(request.priorityId),
                testingStatus = request.inTesting
            )
        }
        provinceRepo.save(province)
    }
}