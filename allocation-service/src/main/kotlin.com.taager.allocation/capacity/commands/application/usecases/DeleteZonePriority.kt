package com.taager.allocation.capacity.commands.application.usecases
import com.taager.allocation.capacity.commands.application.models.RemoveZonePriorityRequest
import com.taager.allocation.capacity.commands.domain.contracts.ProvinceRepo
import com.taager.allocation.capacity.commands.domain.exceptions.ProvinceNotFoundException
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class DeleteZonePriority(private val provinceRepo: ProvinceRepo): UseCase<RemoveZonePriorityRequest, Unit>() {
    override fun execute(request: RemoveZonePriorityRequest) {
        logger.debug("Delete priority in a zone with id of [${request.zoneId}] " +
                "and priority id of [${request.zonePriorityId}]")
        val provinceId = ProvinceId.of(request.provinceId)
        val province = provinceRepo.getById(provinceId).orElseThrow{ProvinceNotFoundException(provinceId)}
        province.removeZonePriority(
            zoneId = ZoneId.of(request.zoneId),
            priorityId = PriorityId.of(request.zonePriorityId)
        )
        provinceRepo.save(province)
    }
}
