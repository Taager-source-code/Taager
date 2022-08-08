package com.taager.allocation.capacity.commands.application.usecases
import com.taager.allocation.capacity.commands.application.models.RemoveProvincePriorityRequest
import com.taager.allocation.capacity.commands.domain.contracts.ProvinceRepo
import com.taager.allocation.capacity.commands.domain.exceptions.ProvinceNotFoundException
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class DeleteProvincePriority(private val provinceRepo: ProvinceRepo): UseCase<RemoveProvincePriorityRequest, Unit>() {
    override fun execute(request: RemoveProvincePriorityRequest) {
        logger.debug("Delete priority in a province with id of [${request.provinceId}] " +
                "and priority id [$request.priorityId]")
        val provinceId = ProvinceId.of(request.provinceId)
        val province = provinceRepo.getById(provinceId).orElseThrow{ProvinceNotFoundException(provinceId)}
        province.removeProvincePriority(priorityId = PriorityId.of(request.provincePriorityId))
        provinceRepo.save(province)
    }
}
