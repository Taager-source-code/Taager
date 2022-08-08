package com.taager.allocation.capacity.commands.application.usecases
import com.taager.allocation.capacity.commands.application.models.AddZonePriorityRequest
import com.taager.allocation.capacity.commands.domain.contracts.ProvinceRepo
import com.taager.allocation.capacity.commands.domain.exceptions.ProvinceNotFoundException
import com.taager.allocation.sharedkernel.domain.models.valueobjects.Capacity
import com.taager.allocation.sharedkernel.domain.models.valueobjects.PriorityId
import com.taager.allocation.capacity.commands.domain.models.valueobjects.ProvinceId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.ZoneId
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class AddZonePriority(private val provinceRepo: ProvinceRepo) : UseCase<AddZonePriorityRequest, Unit>() {
    override fun execute(request: AddZonePriorityRequest) {
        logger.debug("Add shipping company [$request] to a province with id of [${request.provinceId}] and a province with id of [${request.zoneId}]")
        val provinceId = ProvinceId.of(request.provinceId)
        val province = provinceRepo.getById(provinceId).orElseThrow{ProvinceNotFoundException(provinceId)}
        province.addZonePriority(
            zoneId = ZoneId.of(request.zoneId),
            provincePriorityId = PriorityId.of(request.provincePriorityId),
            capacity = request.capacity?.let { Capacity.of(it) }
        )
        provinceRepo.save(province)
    }
}