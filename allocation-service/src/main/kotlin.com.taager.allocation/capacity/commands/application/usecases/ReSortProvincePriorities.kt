package com.taager.allocation.capacity.commands.application.usecases
import com.taager.allocation.capacity.commands.application.models.ReSortProvincePrioritiesRequest
import com.taager.allocation.capacity.commands.domain.contracts.ProvinceRepo
import com.taager.allocation.capacity.commands.domain.exceptions.ProvinceNotFoundException
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class ReSortProvincePriorities(private val provinceRepo: ProvinceRepo) : UseCase<ReSortProvincePrioritiesRequest, Unit>() {
    override fun execute(request: ReSortProvincePrioritiesRequest) {
        logger.debug("Re-sorting shipping companies priorities for province with id: [${request.provinceId}]")
        val provinceId = ProvinceId.of(request.provinceId)
        val province = provinceRepo.getById(provinceId).orElseThrow{ProvinceNotFoundException(provinceId)}
        province.reSortProvincePriorities(
            request.priorities.map { PriorityId.of(it.priorityId) },
            request.resetZones
        )
        provinceRepo.save(province)
    }
}