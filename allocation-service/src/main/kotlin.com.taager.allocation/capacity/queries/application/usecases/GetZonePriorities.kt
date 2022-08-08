package com.taager.allocation.capacity.queries.application.usecases
import com.taager.allocation.capacity.commands.domain.models.valueobjects.toUUIDOrThrow
import com.taager.allocation.capacity.queries.application.contracts.ProvinceRepo
import com.taager.allocation.capacity.queries.application.models.GetZonePrioritiesQuery
import com.taager.allocation.capacity.queries.application.models.ZonePriorityResponse
import com.taager.allocation.sharedkernel.application.UseCase
import org.springframework.stereotype.Service
@Service
class GetZonePriorities(val provinceRepo: ProvinceRepo) :
    UseCase<GetZonePrioritiesQuery, List<ZonePriorityResponse>>() {
    override fun execute(request: GetZonePrioritiesQuery): List<ZonePriorityResponse> {
        logger.debug("Get shipping companies priorities in a province with id of [${request.provinceId}] and in a zone with id of [${request.zoneId}]")
        return provinceRepo.getShippingCompanyPrioritiesForZone(request.zoneId.toUUIDOrThrow()); }
}
