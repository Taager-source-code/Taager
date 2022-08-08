package com.taager.allocation.capacity.commands.application.usecases
import com.taager.allocation.capacity.commands.application.models.AddProvincePriorityRequest
import com.taager.allocation.capacity.commands.domain.contracts.ProvinceRepo
import com.taager.allocation.capacity.commands.domain.exceptions.ProvinceNotFoundException
import com.taager.allocation.capacity.commands.domain.models.valueobjects.*
import com.taager.allocation.sharedkernel.application.UseCase
import com.taager.allocation.sharedkernel.domain.models.valueobjects.Capacity
import com.taager.allocation.sharedkernel.domain.models.valueobjects.CapacityMode
import com.taager.allocation.sharedkernel.domain.models.valueobjects.CompanyId
import com.taager.allocation.sharedkernel.domain.models.valueobjects.CutOffTime
import org.springframework.stereotype.Service
@Service
class AddProvincePriority(private val provinceRepo: ProvinceRepo) : UseCase<AddProvincePriorityRequest, Unit>() {
    override fun execute(request: AddProvincePriorityRequest) {
        logger.debug("Add shipping companyId [${request.companyId}] to a province with id of [${request.provinceId}]")
        val provinceId = ProvinceId.of(request.provinceId)
        val province = provinceRepo.getById(provinceId).orElseThrow{ProvinceNotFoundException(provinceId)}
        province.addProvincePriority(
            companyId = CompanyId.of(request.companyId),
            capacityMode = CapacityMode.of(request.capacityMode),
            capacity = request.capacity?.let { Capacity.of(it) },
            cutOfTime = CutOffTime.of(request.cutOffTime)
        )
        provinceRepo.save(province)
    }
}