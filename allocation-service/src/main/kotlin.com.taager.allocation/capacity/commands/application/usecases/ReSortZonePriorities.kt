package com.taager.allocation.capacity.commands.application.usecases
import com.taager.allocation.capacity.commands.application.models.ReSortZonePrioritiesRequest
import com.taager.allocation.capacity.commands.domain.contracts.ProvinceRepo
import com.taager.allocation.capacity.commands.domain.exceptions.ProvinceNotFoundException
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class ReSortZonePriorities(private val provinceRepo: ProvinceRepo): UseCase<ReSortZonePrioritiesRequest, Unit>() {
    override fun execute(request: ReSortZonePrioritiesRequest) {
        logger.debug("Re-sorting shipping companies priorities for province " +
                "with id of [${request.provinceId}] and it's associated zone" +
                " with id of [${request.zoneId}]")
        val provinceId = ProvinceId.of(request.provinceId)
        val province = provinceRepo.getById(provinceId).orElseThrow{ProvinceNotFoundException(provinceId)}
        province.reSortZonePriorities(
            request.prioritiesIds.map { PriorityId.of(it.priorityId) },
            ZoneId.of(request.zoneId)
        )
        provinceRepo.save(province)
    }
}