package com.taager.allocation.capacity.commands.application.usecases
import com.taager.allocation.capacity.commands.application.models.UpdateProvincePriorityRequest
import com.taager.allocation.capacity.commands.domain.contracts.ProvinceRepo
import com.taager.allocation.capacity.commands.domain.exceptions.ProvinceNotFoundException
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.sharedkernel.application.UseCase
import com.taager.allocation.sharedkernel.domain.models.valueobjects.Capacity
import com.taager.allocation.sharedkernel.domain.models.valueobjects.CapacityMode
import com.taager.allocation.sharedkernel.domain.models.valueobjects.CutOffTime
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
import org.springframework.stereotype.Service
@Service
class UpdateProvincePriority(private val provinceRepo: ProvinceRepo): UseCase<UpdateProvincePriorityRequest, Unit>() {
    override fun execute(request: UpdateProvincePriorityRequest) {
        logger.debug("Updating priority in a province with id of [${request.provinceId}] " +
                "and priority id of [${request.priorityId}]")
        val provinceId = ProvinceId.of(request.provinceId)
        val province = provinceRepo.getById(provinceId).orElseThrow{ProvinceNotFoundException(provinceId)}
        province.updateCapacityMode(
            provincePriorityId = PriorityId.of(request.priorityId),
            newCapacityMode = CapacityMode.of(request.capacityMode),
            capacity = request.capacity?.let { Capacity.of(it) }
        )
        province.updateCutOffTime(
            priorityId = PriorityId.of(request.priorityId),
            cutOffTime = CutOffTime.of(request.cutOffTime)
        )
        if (request.capacity != null) {
            province.updateCapacity(
                priorityId = PriorityId.of(request.priorityId),
                capacity = Capacity.of(request.capacity)
            )
        }
        provinceRepo.save(province)
    }
}