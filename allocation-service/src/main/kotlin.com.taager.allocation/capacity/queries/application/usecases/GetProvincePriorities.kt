package com.taager.allocation.capacity.queries.application.usecases
import com.taager.allocation.capacity.commands.domain.models.valueobjects.toUUIDOrThrow
import com.taager.allocation.capacity.queries.application.contracts.ProvinceRepo
import com.taager.allocation.capacity.queries.application.models.ProvincePriorityResponse
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class GetProvincePriorities(val provinceRepo: ProvinceRepo) : UseCase<String, List<ProvincePriorityResponse>>() {
    override fun execute(provinceId: String): List<ProvincePriorityResponse> {
        logger.debug("Get shipping companies priorities in a province with id of [$provinceId]")
        return provinceRepo.getShippingCompanyPrioritiesForProvince(provinceId.toUUIDOrThrow())
    }
}
